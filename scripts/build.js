"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
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

// config after eject: we're in ./config/
const paths = {
  appPath: resolveApp("."),
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
};

// console.log(paths);

const webpackConfig = {
  mode: "production",
  // Stop compilation early in production
  bail: true,
  devtool: "source-map",
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  entry: ["./src/index.jsx"],
  output: {
    // The build folder.
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: false,
    // There will be one main bundle, and one file per asynchronous chunk.
    // In development, it does not produce real files.
    filename: "static/js/[name].js",
    // TODO: remove this when upgrading to webpack 5
    futureEmitAssets: true,
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: "static/js/[name].chunk.js",
    // webpack uses `publicPath` to determine where the app is being served from.
    // It requires a trailing slash, or the file assets will get an incorrect path.
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: "/",
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: (info) =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, "/"),
    // this defaults to 'window', but by setting it to 'this' then
    // module chunks which are built will work in web workers as well.
    globalObject: "this",
  },
  optimization: {
    minimize: false,
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    splitChunks: {
      chunks: "all",
      name: false,
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Process application JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve("babel-loader"),
        options: {
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
                loose: true,
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      // template: paths.appHtml,
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
  // Turn off performance processing
  performance: false,
};

// Remove all content but keep the directory so that
// if you're in it, you don't end up in Trash
fs.emptyDirSync(paths.appBuild);

// Start the webpack build
build()
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

// Create the production build and print the deployment instructions.
function build() {
  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
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
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join("\n\n")));
      }
      return resolve(messages.warnings);
    });
  });
}
