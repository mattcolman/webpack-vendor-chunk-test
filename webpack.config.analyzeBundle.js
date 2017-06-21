/* eslint import/no-extraneous-dependencies: 0 */
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const mainConfig = require('./webpack.config');

module.exports = Object.assign({}, mainConfig, {
  plugins: mainConfig.plugins.concat([
    new BundleAnalyzerPlugin(),
  ]),
});
