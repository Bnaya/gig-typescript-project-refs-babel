/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const Module = require("module");
const path = require("path");

const origRequire = Module.prototype.require;

const packageNameReg = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

Module.prototype.require = function teachNodeTypeScriptMainRequireWrapper(
  ...args
) {
  // not a package import
  if (!packageNameReg.test(args[0])) {
    return origRequire.apply(this, args);
  }

  try {
    // console.info("going to try typeScriptMain");
    const packageJsonPath = require.resolve(path.join(args[0], "package.json"));
    const packageJsonContent = origRequire.call(this, packageJsonPath);

    if (packageJsonContent.typeScriptMain) {
      console.info("has typeScriptMain field, look for the file");
      const finalPathTopRequire = require.resolve(
        path.join(args[0], packageJsonContent.typeScriptMain)
      );

      console.info("found typeScriptMain file", finalPathTopRequire);

      try {
        return origRequire.call(this, finalPathTopRequire);
      } catch (e) {
        console.error(e);
        console.log("who let the dogs out");
        process.exit(666);
      }
    }
  } catch (e) {
    //
  }

  return origRequire.apply(this, args);
};
