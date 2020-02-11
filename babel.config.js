/* eslint-env node */
// https://babeljs.io/docs/en/options#babelrcroots

const path = require("path");

// console.log(path.resolve(__dirname, "./packages/*"));

module.exports = {
  babelrcRoots: [
    // Keep the root as a root
    ".",

    // Also consider monorepo packages "root" and load their .babelrc.json files.
    // path.resolve(__dirname, "./packages/*"),
    "./packages/*"
  ]
};
