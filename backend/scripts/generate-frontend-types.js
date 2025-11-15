import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating frontend TypeScript types from OpenAPI spec...\n');

// Verify OpenAPI spec exists
const openapiPath = path.resolve(__dirname, '../src/docs/openapi.json');
if (!fs.existsSync(openapiPath)) {
  console.error('Error: openapi.json not found!');
  console.error('   Run "npm run types:openapi" first to generate the OpenAPI spec.');
  process.exit(1);
}

console.log('    OpenAPI spec found');

// Generate TypeScript types from OpenAPI spec
const outputPath = path.resolve(__dirname, '../src/docs/api-types.ts');

try {
  console.log('\n    Running openapi-typescript...');
  execSync(
    `npx openapi-typescript ${openapiPath} -o ${outputPath}`,
    { stdio: 'inherit' }
  );
  console.log('    TypeScript types generated');
} catch (error) {
  console.error('\n Error generating TypeScript types:', error.message);
  process.exit(1);
}

// Copy to frontend using host filesystem (backend/src directory mounted so we can access the generated file from host)
const hostBackendPath = path.resolve(process.cwd(), 'src/docs/api-types.ts');
const hostFrontendPath = path.resolve(process.cwd(), '../frontend/types/api-generated.ts');

console.log(`\n Generated types are ready at:`);
console.log(`   ${hostBackendPath}`);
console.log(`\n To copy to frontend, run from host:`);
console.log(`   cp backend/src/docs/api-types.ts frontend/types/api-generated.ts`);

// Try to copy directly (works if running on host, fails gracefully in Docker)
try {
  const targetDir = path.dirname(hostFrontendPath);
  
  // Check if we can access the frontend directory
  if (fs.existsSync(targetDir)) {
    fs.copyFileSync(hostBackendPath, hostFrontendPath);
    console.log(`\n Successfully copied to frontend!`);
    console.log(`   ${hostFrontendPath}`);
  } else {
    // We're in Docker, can't access frontend directly
    console.log(`\n  Note: Run copy command from host (outside container)`);
  }
} catch (error) {
  // Silent fail
  console.log(`\n  Auto-copy not available in container - copy manually from host`);
}

console.log('\n Type generation complete!\n');
console.log(' Import types in frontend services like this:');
console.log('   import type { components } from "../types/api-generated";');
console.log('   type Movie = components["schemas"]["Movie"];\n');

