/* global require */
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    // Each discrete module that is to be build should be listed here
    'login': './ui/modules/login/login.jsx'
  },
  output: {
    path: path.resolve('.tmp'),
    filename: '[name].min.js'
  },
  module: {
    loaders: [
      // Javascript Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: { presets: [ 'es2015' ] }
      },

      // Jsx React Files
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: { presets:[ 'react', 'es2015' ] }
      },

      // Scss files
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([ 'css-loader', 'sass-loader' ])
      }
    ]
  },
  plugins: [
    // Clear dist directory
    new CleanWebpackPlugin([ '.tmp' ]),

    // Compress JS files
    new webpack.optimize.UglifyJsPlugin(),

    // Set export path for generated style sheets
    new ExtractTextPlugin('[name].min.css'),

    // Minify generated CSS
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/,
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),

    // Copy static Assets
    new CopyWebpackPlugin([
      { from: 'ui/assets', to: 'assets/' }
      // ,
      // { from: 'ui/index.html', to: 'index.html' }
    ]),

    // Minify HTML
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: false,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      moduleName: 'index',
      template: 'views/module.ejs',
      title: 'Plinth Main'
    }),

  ],
  resolve: {
    alias: {
      Component: path.resolve(__dirname, './ui/components/'),
      Style: path.resolve(__dirname, './ui/style/')
    }
  }
};
