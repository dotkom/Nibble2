const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'app/');
const BUILD_DIR = path.resolve(APP_DIR, 'dist/');
const SRC_DIR = path.resolve(APP_DIR, 'src/');

const config = {
  entry: path.resolve(SRC_DIR, 'index.jsx'),
  output: {
    path: BUILD_DIR,
    publicPath: 'app/dist',
    filename: 'bundle.js',
  },
  modules: ['node_modules'],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: [
          APP_DIR,
        ],
        loader: 'babel',
      },
    ],
  },
  resolve: {
    root: [
      SRC_DIR,
    ],
  },
  devServer: {
    historyApiFallback: {
      index: '/app/',
    },
  },
};

module.exports = config;
