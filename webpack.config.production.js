/* eslint-disable */
var path = require("path");
var BundleTracker = require("webpack-bundle-tracker");
var CompressionPlugin = require('compression-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var workbox = require('workbox-webpack-plugin');
var uuid4 = require('uuid4');

var cacheHash = uuid4();


module.exports = {
  entry: ["./react-app/src/js/index"],
  output: {
    path: path.resolve("./react-app/dist/"),
    filename: "[name]-[hash].js",
    publicPath: "/static/" // Tell django to use this URL to load packages and not use STATIC_URL + bundle_name
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
    new workbox.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      inlineWorkboxRuntime: true,
      // here, we set the navigateFallback to '/',
      // so that any missing urls are handled by react-router
      navigateFallback: '/',
      additionalManifestEntries: [
        { url: "/", revision: cacheHash },
        { url: "/manifest.json", revision: cacheHash },
        { url: "/static/images/my_app_icon.png", revision: cacheHash },
      ]
    }),
    new CompressionPlugin()
  ],
  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx"]
  }
};
