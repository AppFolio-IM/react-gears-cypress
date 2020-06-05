/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src'),

  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx', '.json'],
  },

  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
};
