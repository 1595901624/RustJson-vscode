//@ts-check

'use strict';

const path = require('path');
const webpack = require('webpack');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const RustBuilderPlugin = require("./rust.build.js");
// const { fileURLToPath } = require("url");

// const filename = fileURLToPath(__dirname);
// const dirname = path.dirname(filename);

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js', '.wasm', '.html']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      // {
      //   test: /\.wasm$/,
      //   type: "webassembly/experimental"
      // }
      // 输出目录下的wasm文件到根目录
      // {
      //   test: /\.wasm$/i,
      //   use: [
      //     {
      //       loader: 'wasm-loader',
      //     }
      //   ],
      // },
    ]
  },
  plugins: [
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, '.')
    // })
    new RustBuilderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: "pkg", to: "." },
        { from: "static", to: "./static" }
      ]
    })
  ],
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
  experiments: {
    asyncWebAssembly: true,
    syncWebAssembly: true,
  }
};
module.exports = [extensionConfig];