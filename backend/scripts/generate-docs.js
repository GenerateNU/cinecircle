import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'CineCircle API',
    description: 'API documentation from Express routes',
    version: '1.0.0',
  },
  host: 'localhost:3001',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

// auto-generate from Express routes
swaggerAutogen()(outputFile, endpointsFiles, doc);
