/* eslint-disable */
var path = require("path");
var webpack = require("webpack");
var BundleTracker = require("webpack-bundle-tracker");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    "webpack-dev-server/client?http://localhost:3000",
    "webpack/hot/only-dev-server",
    "./react-app/src/js/index"
  ],
  devtool: 'inline-cheap-module-source-map',
  output: {
    path: path.resolve("./react-app/bundles/"),
    filename: "[name].js",
    publicPath: "http://localhost:3000/static/react-app/bundles/" // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
    new BundleTracker({
      path: __dirname,
      filename: "./webpack-stats.json"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx"]
  }
};
