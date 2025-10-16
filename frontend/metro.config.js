const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prevent Metro from crawling other folders for configs
config.resolver.disableHierarchicalLookup = true;
// Ignore any .babelrc buried in node_modules
config.resolver.blockList = [/node_modules\/.*\/\.babelrc/];

module.exports = config;
