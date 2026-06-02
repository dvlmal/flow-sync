const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function (options) {
  return {
    ...options,
    // 모든 종속성을 번들에 포함 (Vercel serverless 호환)
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
  };
};
