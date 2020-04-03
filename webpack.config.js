const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const workboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "source-map",
  entry: { main: ["./src/index.js"] },
  output: {
    filename: "[name].bundle.js",
    path: dist,
    hotUpdateMainFilename: "hot-update.json",
    hotUpdateChunkFilename: "hot-update.js",
    publicPath: process.env.PUBLIC_PATH,
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: ["*"],
    host: "0.0.0.0",
    port: port,
    inline: true,
    hot: true,
    writeToDisk: true,
    proxy: {
      changeOrigin: true,
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
      path: dist,
      publicPath: process.env.PUBLIC_PATH,
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      GRAPH_URL: JSON.stringify(process.env.GRAPH_URL),
      DEBUG: process.env.DEBUG,
      NODE_ENV: process.env.NODE_ENV,
      WORKER: JSON.stringify(process.env.WORKER),
      PUBLIC_PATH: JSON.stringify(process.env.PUBLIC_PATH),
    }),
    new workboxPlugin.InjectManifest({
      swSrc: "./src/worker/worker.js",
      swDest: "worker.js",
    }),
    new CopyWebpackPlugin([{ from: "src/public" }]),
    new HtmlWebpackPlugin({ template: "src/index.html" }),
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env", "@babel/preset-react"] },
      },
      {
        test: /\.(sc|sa)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(t|o)tf$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "application/octet-stream",
        },
      },
      {
        test: /\.woff2?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          mimetype: "application/font-woff",
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.(jpg|png|git)$/i,
        loader: "file-loader?name=app/images/[name].[ext]",
      },
      { type: "javascript/auto", test: /\.json$/, loader: "json-loader" },
      { test: /\.worker\.js$/, use: { loader: "worker-loader" } },
    ],
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".json", ".js", ".jsx", ".mjs", ".gql", ".graphql"],
  },
};
