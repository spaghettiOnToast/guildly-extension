const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const { DefinePlugin, ProvidePlugin } = require("webpack")

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/ui/index.html",
    filename: "./index.html",
    excludeChunks: ["inject", "inpage", "background"],
  })

module.exports = {
    entry: {
        main: "./src/ui",
        inject: "./src/content",
        inpage: "./src/inpage",
        background: "./src/background",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        sourceMapFilename: "../sourcemaps/[file].map",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "esbuild-loader",
                options: {
                  loader: "tsx", // Or 'ts' if you don't need tsx
                  target: "es2015",
                },
              },
        ]
    },
    plugins: [
        htmlPlugin,
        new CopyPlugin({
            patterns: [
              { from: "./src/ui/favicon.svg", to: "favicon.svg" },
              { from: "./src/manifest.json", to: "manifest.json" },
              { from: "./src/assets", to: "assets" },
            ],
          }),
        new ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          React: "react",
        }),
        new Dotenv({
          systemvars: true,
          safe: false,
        }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: { buffer: require.resolve("buffer/") },
        alias: {
          "@mui/styled-engine": "@mui/styled-engine-sc",
        },
    }
};