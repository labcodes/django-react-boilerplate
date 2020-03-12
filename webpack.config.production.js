/* eslint-disable */
var path = require("path");
var BundleTracker = require("webpack-bundle-tracker");
var CompressionPlugin = require('compression-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ["./react-app/src/js/index"],
  output: {
    path: path.resolve("./static/react-app/dist/"),
    filename: "[name]-[hash].js",
    publicPath: "/static/react-app/dist/" // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new BundleTracker({
      path: __dirname,
      filename: "./webpack-stats.json"
    }),
    new MiniCssExtractPlugin({
      filename: "[name]-[hash].css"
    }),
    new CompressionPlugin()
  ],
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx"]
  }
};
