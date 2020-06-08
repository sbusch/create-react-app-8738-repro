"use strict";

// Makes the script crash on unhandled rejections instead of silently ignoring them.
process.on("unhandledRejection", (err) => {
  throw err;
});

const path = require("path");
const chalk = require("react-dev-utils/chalk");
const fs = require("fs-extra");
const webpack = require("webpack");
const formatWebpackMessages = require("react-dev-utils/formatWebpackMessages");
const printBuildError = require("react-dev-utils/printBuildError");

const HtmlWebpackPlugin = require("html-webpack-plugin");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const buildPath = resolveApp("build");
const srcPath = resolveApp("src");

// console.log("paths", { buildPath, srcPath });

const webpackConfig = {
  mode: "production",
  // Stop compilation early in production
  bail: true,
  devtool: "source-map",
  entry: ["./src/index.jsx"],
  output: {
    path: buildPath,
    futureEmitAssets: true,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) =>
      path.relative(srcPath, info.absoluteResourcePath).replace(/\\/g, "/"),
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
            "@babel/plugin-transform-react-jsx",
            [
              "@babel/plugin-proposal-class-properties",
              {
                // Enable loose mode to use assignment instead of defineProperty
                // See discussion in https://github.com/facebook/create-react-app/issues/4263
                loose: true,
              },
            ],
            [
              "@babel/plugin-transform-classes",
              {
                loose: false,
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    // Despite production build, let React (react, react-dom, ...) pretend to be
    // in development mode (production mode masks runtime errors behind "Minified
    // React errors")
    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),

    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      templateContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
      `,
      minify: false,
    }),
  ],
};

// Remove all content of build path
fs.emptyDirSync(buildPath);

// Start the webpack build
new Promise((resolve, reject) => {
  webpack(webpackConfig).run((err, stats) => {
    let messages;
    if (err) {
      if (!err.message) {
        return reject(err);
      }

      let errMessage = err.message;

      messages = formatWebpackMessages({
        errors: [errMessage],
        warnings: [],
      });
    } else {
      messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
      );
    }
    if (messages.errors.length) {
      return reject(new Error(messages.errors.join("\n\n")));
    }
    return resolve(messages.warnings);
  });
})
  .then(
    (warnings) => {
      if (warnings.length) {
        console.log(chalk.yellow("Compiled with warnings.\n"));
        console.log(warnings.join("\n\n"));
      } else {
        console.log(chalk.green("Compiled successfully.\n"));
      }
    },
    (err) => {
      console.log(chalk.red("Failed to compile.\n"));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
