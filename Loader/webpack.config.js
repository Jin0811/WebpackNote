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
      //   loader: "./loaders/00_test_loader.js"
      // },
      {
        test: /\.js$/,
        use: [
          // loader的四种类型
          // "./loaders/01_sync_loader.js",
          // "./loaders/02_async_loader.js",
          // "./loaders/03_raw_loader.js",
          // "./loaders/04_pitching_loader.js",

          // 清除console.log();
          "./loaders/05_clean_log_loader.js",

          // 
          "./loaders/06_banner_loader.js",
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
