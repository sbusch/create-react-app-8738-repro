"use strict";

// Makes the script crash on unhandled rejections instead of silently ignoring them.
process.on("unhandledRejection", (err) => {
  throw err;
});

const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const buildPath = path.resolve(__dirname, "./build");
const srcPath = path.resolve(__dirname, "./src");
// console.log("paths", { buildPath, srcPath });

module.exports = {
  mode: "production",
  // Stop compilation early in production
  bail: true,
  devtool: "source-map",
  entry: "./src/index.jsx",
  output: {
    path: buildPath,
    futureEmitAssets: true,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
  },
  performance: false,
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: require.resolve("babel-loader"),
        options: {
          plugins: [
            //*
            [
              "@babel/plugin-transform-react-jsx",
              {
                // Rule out that PURE markers are the culprit
                pure: false,
              },
            ],
            //*/
            //*
            [
              "@babel/plugin-proposal-class-properties",
              {
                // Enable loose mode to use assignment instead of defineProperty
                // See discussion in https://github.com/facebook/create-react-app/issues/4263
                loose: true,
              },
            ],
            //*/
            //*
            [
              "@babel/plugin-transform-classes",
              {
                loose: false,
              },
            ],
            //*/
          ],
        },
      },
    ],
  },
  plugins: [
    // Despite production build, let React (react, react-dom, ...) pretend to be
    // in development mode (production mode masks runtime errors behind "Minified
    // React errors")
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),

    new CleanWebpackPlugin(),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      templateContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          <div id="test1"></div>
          <div id="test2"></div>
        </body>
      </html>
      `,
      minify: false,
    }),
  ],
};
