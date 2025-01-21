const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

module.exports = {
  ...webpackConfig,

  mode: 'development',
  devtool: 'source-map',

  plugins: [
    ...webpackConfig.plugins,
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],
  devServer: {
    static: '../../docs',
    compress: false,
    port: 12345,
  },
  // Other options...
};
