/* eslint-env node */
// https://babeljs.io/docs/en/options#babelrcroots
module.exports = {
  babelrcRoots: [
    // Keep the root as a root
    ".",

    // Also consider monorepo packages "root" and load their .babelrc.json files.
    "./packages/*"
  ]
};
