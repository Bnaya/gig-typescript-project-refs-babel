/* eslint-env node */
/**
 * We need to programmatically call @babel/register and not use babel-node because it won't transpile files outside of cwd (As to date)
 * https://github.com/babel/babel/issues/8309#issuecomment-449515834
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("@babel/register")({
  rootMode: "upward",
  ignore: [/node_modules/],
  extensions: [".js", ".ts"]
});

require("./teachNodeNoneStandardTypeScriptMain");
