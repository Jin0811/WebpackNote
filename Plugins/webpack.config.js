const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TestPlugin = require("./plugins/TestPlugin");

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
    rules: [],
  },

  plugins: [
    // HTML自动引入打包后的资源
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    new TestPlugin(),
  ],
};
