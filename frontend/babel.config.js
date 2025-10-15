module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-typescript'],
    plugins: [
      '@babel/plugin-transform-react-jsx',
      'nativewind/babel',
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
        },
      ],
    ],
  };
};