"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginTransformReactJsx = _interopRequireDefault(
  require("@babel/plugin-transform-react-jsx")
);

var _pluginTransformReactDisplayName = _interopRequireDefault(
  require("@babel/plugin-transform-react-display-name")
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
  api.assertVersion(7);
  const {
    pragma,
    pragmaFrag,
    pure,
    throwIfNamespace = true,
    useSpread,
    runtime = "classic",
    importSource,
  } = opts;
  
  console.log('babel--preset-react opts', opts);
  const useBuiltIns = !!opts.useBuiltIns;

  return {
    plugins: [
      [
        _pluginTransformReactJsx.default,
        {
          importSource,
          pragma,
          pragmaFrag,
          runtime,
          throwIfNamespace,
          useBuiltIns,
          useSpread,
          pure,
        },
      ],
      _pluginTransformReactDisplayName.default,
    ],
  };
});

exports.default = _default;
