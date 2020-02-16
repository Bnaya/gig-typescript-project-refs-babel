/**
 * Teach node & @babel/register to be able to load TypeScript project references, without pre-compilation, with a little help.
 * Motivation: https://github.com/TypeStrong/ts-node/issues/897 support via ts-node is more difficult
 * We do not figure/guess where's the `index.ts` is, as tsc dose, you will need to specify it on an additional package.json field.
 * called `noneStandardTypeScriptMain`. eg: "noneStandardTypeScriptMain": "src/index.ts"
 * Why? the logic to detect the real files is complex:
 * https://github.com/microsoft/TypeScript/blob/80ad0de/src/compiler/program.ts#L2551-L2574
 * And it's easy to setup webpack for that by adding additional `mainField`
 * https://webpack.js.org/configuration/resolve/#resolvemainfields
 */
//
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const NONE_STANDARD_FIELD_NAME = "noneStandardTypeScriptMain";

const Module = require("module");
const path = require("path");

const origRequire = Module.prototype.require;

// https://github.com/SchemaStore/schemastore/blob/master/src/schemas/json/package.json#L82-L87
const packageNameReg = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

// Takeover node's require
Module.prototype.require = function teachNodeNoneStandardTypeScriptMainRequireWrapper(
  ...args
) {
  // Ignore none-package barrel import
  if (!packageNameReg.test(args[0])) {
    return origRequire.apply(this, args);
  }

  try {
    // find the package.json of the required package
    const packageJsonPath = require.resolve(path.join(args[0], "package.json"));
    const packageJsonContent = origRequire.call(this, packageJsonPath);

    // Check if we have the "typescript main field for the package"
    if (packageJsonContent[NONE_STANDARD_FIELD_NAME]) {
      // console.info("has typeScriptMain field, look for the file");

      // Calculate the absolute path of the "typescript main"
      const finalPathTopRequire = require.resolve(
        path.join(args[0], packageJsonContent[NONE_STANDARD_FIELD_NAME])
      );

      // console.info("found typeScriptMain file", finalPathTopRequire);

      try {
        // require & return the "typescript main" and not the regular main field
        return origRequire.call(this, finalPathTopRequire);
      } catch (e) {
        //
      }
    }
  } catch (e) {
    //
  }

  // fallback to regular node require
  return origRequire.apply(this, args);
};
