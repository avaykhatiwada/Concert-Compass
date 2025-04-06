const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  projectId: "jady7j",
  reporter: "mochawesome",

  reporterOptions: {
    reportDir: "cypress/results",
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: "ConcertCompass Test Report",
    embeddedScreenshots: true,
    timestamp: "mmddyyyy_HHMMss",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
