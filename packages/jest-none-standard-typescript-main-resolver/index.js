/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const NONE_STANDARD_FIELD_NAME = require("@local-namespace/teach-node-none-standard-typescript-main/consts")
  .NONE_STANDARD_FIELD_NAME;
const resolveTypeScriptMainIfApplicable = require("@local-namespace/teach-node-none-standard-typescript-main/resolveTypeScriptMainIfApplicable")
  .resolveTypeScriptMainIfApplicable;

/**
 * https://jestjs.io/docs/en/configuration#resolver-string
 *
 * @param moduleToResolve {string}
 * @param jestResolverContext {*}
 */
module.exports = function jestTypeScriptProjectRefsResolver(
  moduleToResolve,
  jestResolverContext
) {
  const resolved = resolveTypeScriptMainIfApplicable(
    moduleToResolve,
    NONE_STANDARD_FIELD_NAME,
    jestResolverContext.paths
  );

  if (resolved) {
    console.log("resolved!!!", resolved);
    return resolved;
  }

  // console.log("NOT!", moduleToResolve);

  return jestResolverContext.defaultResolver(
    moduleToResolve,
    jestResolverContext
  );
};
