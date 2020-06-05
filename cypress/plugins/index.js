/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('@cypress/webpack-preprocessor');

module.exports = async (on, config) => {
  on(
    'file:preprocessor',
    webpack({ webpackOptions: require('../webpack.config') })
  );

  return config;
};
