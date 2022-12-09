import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    setupNodeEvents(on, config) {},
    viewportWidth: 640,
    viewportHeight: 480,
    specPattern: "cypress/component/**/*.cy.{js,ts,jsx,tsx}",
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
