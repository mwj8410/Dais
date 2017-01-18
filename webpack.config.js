const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpack = require('webpack');

module.exports = {
  entry: {
    main: './tests/test.loader.js'
  },
  output: {
    filename: './tests/output/[name].js'
  },
  module: {
    loaders: [
      // Style
      { test: /\.s?css$/, loader: ExtractTextPlugin.extract([ 'css?-minimize', 'sass' ]) },

      // This may need some atention when js files are being included from node_modules
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: [ 'es2015' ] } },

    ]
  },
  plugins: [
    // First destroy the existing dist folder
    new CleanWebpackPlugin(['./tests/output/*']),

    // Set export path for generated style sheets
    new ExtractTextPlugin('./tests/output/[name].css')
  ],
  sassLoader: {
    includePaths: [],
    outputStyle: 'expanded'
  }
};
