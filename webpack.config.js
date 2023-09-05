//@ts-check

'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 赋予 webpack 处理 wasm 才能的插件
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin"); 
const webpack = require('webpack');

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
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/, path.resolve('src/wasm/rust_json_lib_rs_bg.wasm')],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      // {
      //   test: /\.wasm$/,
      //   use: [
      //     {
      //       loader: 'wasm-loader'
      //     }
      //   ]
      // }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, ".")
    }),
    // Have this example work in Edge which doesn't ship `TextEncoder` or
    // `TextDecoder` at this time. 处理浏览器兼容问题
    // new webpack.ProvidePlugin({
    //   TextDecoder: ['text-encoding', 'TextDecoder'],
    //   TextEncoder: ['text-encoding', 'TextEncoder']
    // })
],
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
  experiments: {
    asyncWebAssembly: true
  }
};
module.exports = [ extensionConfig ];