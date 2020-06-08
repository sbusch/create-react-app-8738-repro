/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

const path = require("path");

const validateBoolOption = (name, value, defaultValue) => {
  if (typeof value === "undefined") {
    value = defaultValue;
  }

  if (typeof value !== "boolean") {
    throw new Error(`Preset react-app: '${name}' option must be a boolean.`);
  }

  return value;
};

const create = function (api, opts) {
  if (!opts) {
    opts = {};
  }

  var useESModules = validateBoolOption(
    "useESModules",
    opts.useESModules,
    true
  );
  var areHelpersEnabled = validateBoolOption("helpers", opts.helpers, true);
  var useAbsoluteRuntime = validateBoolOption(
    "absoluteRuntime",
    opts.absoluteRuntime,
    true
  );

  var absoluteRuntimePath = undefined;
  if (useAbsoluteRuntime) {
    absoluteRuntimePath = path.dirname(
      require.resolve("@babel/runtime/package.json")
    );
  }

  return {
    plugins: ["transform-classes"],
    presets: [
      false && [
        // Latest stable ECMAScript features
        require("@babel/preset-env").default,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: "entry",
          // Set the corejs version we are using to avoid warnings in console
          // This will need to change once we upgrade to corejs@3
          corejs: 3,
          debug: true,
          exclude: [
            "proposal-nullish-coalescing-operator",
            "proposal-optional-chaining",
            "proposal-json-strings",
            "proposal-optional-catch-binding",
            "transform-parameters",
            "proposal-async-generator-functions",
            "proposal-object-rest-spread",
            "transform-dotall-regex",
            "proposal-unicode-property-regex",
            "transform-named-capturing-groups-regex",
            "transform-async-to-generator",
            "transform-exponentiation-operator",
            "transform-template-literals",
            "transform-literals",
            "transform-function-name",
            "transform-arrow-functions",
            // "transform-classes",
            "transform-object-super",
            "transform-shorthand-properties",
            "transform-duplicate-keys",
            "transform-computed-properties",
            "transform-for-of",
            "transform-sticky-regex",
            "transform-unicode-regex",
            "transform-spread",
            "transform-destructuring",
            "transform-block-scoping",
            "transform-typeof-symbol",
            "transform-new-target",
            "transform-regenerator",
            // "syntax-dynamic-import",
            // "syntax-top-level-await",
          ],
          // loose: true
        },
      ],
      [
        require("../babel--preset-react").default,
        {
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          // useBuiltIns: true,
          // useBuiltIns: false,
        },
      ],
    ].filter(Boolean),
    plugins: [
      [
        require("@babel/plugin-proposal-class-properties").default,
        {
          // Enable loose mode to use assignment instead of defineProperty
          // See discussion in https://github.com/facebook/create-react-app/issues/4263
          loose: true,
        },
      ],
      [
        require("@babel/plugin-transform-classes").default,
        {
          loose: true,
        }
      ],
      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      false && [
        require("@babel/plugin-transform-runtime").default,
        {
          corejs: false,
          helpers: areHelpersEnabled,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require("@babel/runtime/package.json").version,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules,
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
    ].filter(Boolean),
  };
};

module.exports = function (api, opts) {
  return create(api, opts);
};
