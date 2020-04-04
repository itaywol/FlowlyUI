const { resolve } = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WorkerPlugin = require("worker-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";
const dist = resolve(__dirname, "dist");

console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log(process.env.PUBLIC_PATH);

const config = {
  entry: {
    main: resolve("./src/index.tsx"),
  },
  output: {
    path: dist,
    hotUpdateChunkFilename: "hot-update.js",
    hotUpdateMainFilename: "hot-update.json",
    publicPath: process.env.PUBLIC_PATH,
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: ["*"],
    host: "0.0.0.0",
    port: 5858,
    inline: true,
    hot: true,
    writeToDisk: true,
    proxy: {
      changeOrigin: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ["awesome-typescript-loader?module=es6"],
        exclude: [/node_modules/],
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
        enforce: "pre",
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: !isDevelopment },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new CopyWebpackPlugin([
      { from: "public", to: "dist" },
      { from: "src/worker", to: "" },
    ]),
  ],
};

module.exports = config;
