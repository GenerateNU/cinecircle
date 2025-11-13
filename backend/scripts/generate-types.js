import { createGenerator } from 'ts-json-schema-generator';
import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Discovering API types from TypeScript files...\n');

// Parse TypeScript files to extract exported type names
function extractTypeNames(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    path.basename(filePath),
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const typeNames = [];

  function visit(node) {
    // Extract type aliases and interfaces
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
      const name = node.name.text;
      
      // Skip utility types and generic helpers
      const skipPatterns = [
        /^Pick</,
        /^Omit</,
        /^Partial</,
        /^Required</,
        /^Record</,
        /^Exclude</,
        /^Extract</,
        /^Key$/,
        /^Res</,
        /^Body</,
      ];
      
      const shouldSkip = skipPatterns.some(pattern => pattern.test(name));
      
      if (!shouldSkip && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
        typeNames.push(name);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return typeNames;
}

// Get type names from both files
const typesDir = path.resolve(__dirname, '../src/types');
const apiTypesPath = path.join(typesDir, 'apiTypes.ts');
const modelsPath = path.join(typesDir, 'models.ts');

let discoveredTypes = [];

if (fs.existsSync(apiTypesPath)) {
  const apiTypes = extractTypeNames(apiTypesPath);
  console.log(` Found ${apiTypes.length} types in apiTypes.ts`);
  discoveredTypes = discoveredTypes.concat(apiTypes);
}

if (fs.existsSync(modelsPath)) {
  const modelTypes = extractTypeNames(modelsPath);
  console.log(` Found ${modelTypes.length} types in models.ts`);
  discoveredTypes = discoveredTypes.concat(modelTypes);
}

// Remove duplicates
discoveredTypes = [...new Set(discoveredTypes)];

console.log(`\n Total discovered types: ${discoveredTypes.length}`);
console.log(`   ${discoveredTypes.join(', ')}\n`);

// Generate JSON schemas for all discovered types
console.log('Generating JSON schemas...\n');

const config = {
  path: 'src/types/*.ts',
  tsconfig: 'tsconfig.json',
  type: '*',
  expose: 'export',
  skipTypeCheck: true,
  extraTags: [],
  additionalProperties: false,
};

const generator = createGenerator(config);
const schemas = {};
const skipped = [];

discoveredTypes.forEach(typeName => {
  try {
    const schema = generator.createSchema(typeName);
    schemas[typeName] = schema;
    console.log(`   ${typeName} (generated)`);
  } catch (error) {
    skipped.push(typeName);
    console.log(`   ${typeName} (skipped: ${error.message.split('\n')[0]})`);
  }
});

// Write schemas to file
const docsDir = path.resolve(__dirname, '../src/docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const outputPath = path.join(docsDir, 'schemas.json');
fs.writeFileSync(outputPath, JSON.stringify(schemas, null, 2));

console.log(`\nGenerated ${Object.keys(schemas).length} schemas`);
console.log(`   Saved to: ${path.relative(process.cwd(), outputPath)}`);

if (skipped.length > 0) {
  console.log(`\nSkipped ${skipped.length} types: ${skipped.join(', ')}`);
}

console.log('\nType discovery complete!\n');

