const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 模式 mode
  mode: "development", // development | production

  entry: "./src/main.js",

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name].js",
    clean: true,
  },

  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: "./loaders/00_test-loader.js"
      // },
      {
        test: /\.js$/,
        use: [
          // loader的四种类型
          // "./loaders/01_sync-loader.js",
          // "./loaders/02_async-loader.js",
          // "./loaders/03_raw-loader.js",
          // "./loaders/04_pitching-loader.js",

          // 清除console.log();
          "./loaders/05_clean-log-loader.js",
        ],
      },
    ],
  },

  plugins: [
    // HTML自动引入打包后的资源
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
};
