/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = async (on, config) => {
  config.env.webpackFilename = 'webpack.config.js';
  require('@cypress/react/plugins/load-webpack')(on, config);

  return config;
};
