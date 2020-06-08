"use strict";

module.exports = function (api, opts) {
  if (!opts) {
    opts = {};
  }

  return {
    presets: [],
    plugins: [
      "@babel/plugin-transform-react-jsx",
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
          loose: false,
        },
      ],
    ],
  };
};
