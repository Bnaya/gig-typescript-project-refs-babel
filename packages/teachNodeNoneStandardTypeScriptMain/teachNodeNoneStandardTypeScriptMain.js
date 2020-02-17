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

const NONE_STANDARD_FIELD_NAME = require("./consts").NONE_STANDARD_FIELD_NAME;

const Module = require("module");
const resolveTypeScriptMainIfApplicable = require("./resolveTypeScriptMainIfApplicable")
  .resolveTypeScriptMainIfApplicable;

const origRequire = Module.prototype.require;

// Takeover node's require
Module.prototype.require = function teachNodeNoneStandardTypeScriptMainRequireWrapper(
  ...args
) {
  const resolved = resolveTypeScriptMainIfApplicable(
    args[0],
    NONE_STANDARD_FIELD_NAME,
    this.paths
  );

  if (!resolved) {
    return origRequire.apply(this, args);
  }

  try {
    return origRequire.call(this, resolved);
  } catch (e) {
    //
  }

  // fallback to regular node require
  return origRequire.apply(this, args);
};
