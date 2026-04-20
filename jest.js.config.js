module.exports = {
  testEnvironment: "node",
  testMatch: ["**/test/integration/**/*.test.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/test/index.js",
    "/test/config.js",
    "/test/sync_config.js",
    "/test/helpers/",
    "/test/.*/utils.js",
  ],
  reporters: ["default", ["jest-html-reporters",
    {
      "filename": "tap-html.html",
      "expand": true,
      "inlineSource": true,
      "includeFailureMsg": true, // Includes error messages in JSON
      "includeConsoleLog": true
    }
  ]],
};