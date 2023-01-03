import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,ts,jsx,tsx}',
    video: false,
    viewportWidth: 640,
    viewportHeight: 480,
  },
});
