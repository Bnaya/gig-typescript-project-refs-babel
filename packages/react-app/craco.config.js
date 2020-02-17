module.exports = function ({ env }) {
  return {
    // cra uses fork-ts-checker-webpack-plugin@3 under the hood, that dose not support project refs (yet! v4 seems yes),
    // So we cancel the built-in type check. for typecheck, run tsc separately on noEmit mode
    // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/187
    typescript: {
      enableTypeChecking: false
    },
    webpack: {
      configure(webpackConfig, { env, paths }) {
        webpackConfig.resolve.mainFields = [
          // this is the `magic`
          'noneStandardTypeScriptMain',
          'browser', 'module', 'main']
        return webpackConfig;
      }
    },
    jest: {
      configure(jestConfig) {
        jestConfig.resolver =  "@local-namespace/jest-none-standard-typescript-main-resolver";

        return jestConfig;
      }
    }
  };
}
