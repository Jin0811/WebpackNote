const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
// const TestPlugin = require("./plugins/TestPlugin");
const BannerWebpackPlugin = require("./plugins/BannerWebpackPlugin");
const CleanWebpackPlugin = require("./plugins/CleanWebpackPlugin");
const AnalyzeWebpackPlugin = require("./plugins/AnalyzeWebpackPlugin");

module.exports = {
  // 模式 mode
  mode: "development", // development | production

  entry: "./src/main.js",

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "js/[name].js",
    // clean: true, // 使用自定义的CleanWebpackPlugin
  },

  module: {
    rules: [
      {
        test: /\.css$/i, // 只检测.css文件
        use: [
          "style-loader", // style-loader将js中的css通过创建style标签的形式添加到页面当中
          "css-loader", // css-loader会将css资源编译成commonjs的一个模块到js当中
        ],
      },
    ],
  },

  plugins: [
    // HTML自动引入打包后的资源
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
    // new TestPlugin(),
    new BannerWebpackPlugin({ author: "张三" }),
    new CleanWebpackPlugin(),
    new AnalyzeWebpackPlugin(),
  ],
};
