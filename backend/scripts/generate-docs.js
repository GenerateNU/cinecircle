import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Generating OpenAPI 3.0 documentation...\n');

// Read auto-generated schemas
const schemasPath = path.resolve(__dirname, '../src/docs/schemas.json');
let schemas = {};

if (fs.existsSync(schemasPath)) {
  const rawSchemas = JSON.parse(fs.readFileSync(schemasPath, 'utf-8'));
  
  // Flatten schemas: extract definitions and convert internal refs to OpenAPI refs
  schemas = {};
  for (const [typeName, schema] of Object.entries(rawSchemas)) {
    if (schema.definitions && schema.definitions[typeName]) {
      // Use the actual definition, not the wrapper
      const definition = schema.definitions[typeName];
      
      // Convert internal references to OpenAPI component references
      const flattenedDef = JSON.parse(
        JSON.stringify(definition).replace(
          /#\/definitions\//g,
          '#/components/schemas/'
        )
      );
      
      schemas[typeName] = flattenedDef;
      
      // Also add any additional definitions from this schema
      for (const [defName, defSchema] of Object.entries(schema.definitions)) {
        if (defName !== typeName && !schemas[defName]) {
          const flattened = JSON.parse(
            JSON.stringify(defSchema).replace(
              /#\/definitions\//g,
              '#/components/schemas/'
            )
          );
          schemas[defName] = flattened;
        }
      }
    } else {
      schemas[typeName] = schema;
    }
  }
  
  console.log(`   Loaded ${Object.keys(schemas).length} schemas from schemas.json`);
} else {
  console.log('   No schemas.json found - run "npm run types:discover" first');
}

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'CineCircle API',
    description: 'API documentation from Express routes',
    version: '1.0.0',
  },
  servers: [
    { 
      url: 'http://localhost:3001',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from Supabase authentication'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './src/docs/openapi.json';
const endpointsFiles = ['./src/app.ts'];

// Auto-generate from Express routes
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc)
  .then(() => {
    // Read the generated file and add our schemas
    const generatedSpec = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    
    // Add our schemas to components
    if (!generatedSpec.components) {
      generatedSpec.components = {};
    }
    if (!generatedSpec.components.schemas) {
      generatedSpec.components.schemas = {};
    }
    
    // Merge in our auto-discovered schemas
    Object.assign(generatedSpec.components.schemas, schemas);
    
    // Write the final spec
    fs.writeFileSync(outputFile, JSON.stringify(generatedSpec, null, 2));
    
    console.log(`\nOpenAPI 3.0 spec generated with ${Object.keys(schemas).length} schemas`);
    console.log(`   Saved to: src/docs/openapi.json`);
    console.log('\nDocumentation generation complete!\n');
  })
  .catch(err => {
    console.error('\nError generating OpenAPI spec:', err);
    process.exit(1);
  });
