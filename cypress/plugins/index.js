/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = async (on, config) => {
  config.env.webpackFilename = 'webpack.config.js';
  require('cypress-react-unit-test/plugins/load-webpack')(on, config);

  return config;
};
