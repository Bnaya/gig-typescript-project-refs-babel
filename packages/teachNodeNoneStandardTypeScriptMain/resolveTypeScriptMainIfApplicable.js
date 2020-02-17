/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

// https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json#L82-L87
const packageNameReg = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

module.exports.resolveTypeScriptMainIfApplicable = resolveTypeScriptMainIfApplicable;

/**
 * Resolve the value of `typescriptMain` if applicable
 * Example:
 * {
 * "main": "dist/index.js",
 * "typescriptMain": "src/index.ts"
 * }
 *
 * @param {string} inputStr
 * @param {string} mainFieldName
 * @param {string[]} requirerPaths
 *
 * @returns {string | undefined}
 */
function resolveTypeScriptMainIfApplicable(
  inputStr,
  mainFieldName,
  requirerPaths
) {
  // Ignore none-package barrel import
  if (!packageNameReg.test(inputStr)) {
    return;
  }

  // console.log(inputStr);

  try {
    // if (inputStr.includes("@local-namespace/common-package")) {
    //   console.log(inputStr);
    //   // while (true) {}
    // }

    // find the package.json of the required package
    const packageJsonPath = require.resolve(
      path.join(inputStr, "package.json"),
      {
        paths: requirerPaths
      }
    );

    // Consider: Should we use the requirer require?
    // Read package.json content
    const packageJsonContent = require(packageJsonPath);
    // if (inputStr.includes("@local-namespace/common-package")) {
    //   console.log(packageJsonContent);
    //   while (true) {}
    // }

    // Check if we have the "typescriptMain field for the package
    if (packageJsonContent[mainFieldName]) {
      // console.info("has typeScriptMain field, look for the file");

      // Calculate the absolute path of the "typescriptMain"
      const finalPathTopRequire = require.resolve(
        path.join(inputStr, packageJsonContent[mainFieldName]),
        {
          paths: requirerPaths
        }
      );

      return finalPathTopRequire;
    }
  } catch (e) {
    if (inputStr.includes("@local-namespace/common-package")) {
      console.log(inputStr);
      console.log(e);
      console.log(requirerPaths);
      process.exit(1);
    }
  }
}
