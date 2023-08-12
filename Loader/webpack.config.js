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
        ],
      },
      // 自动添加注释的loader
      {
        test: /\.js$/,
        loader: "./loaders/06_banner_loader.js",
        options: {
          author: "张三",
        },
      },
      // 自定义的babel-loader
      {
        test: /\.js$/,
        loader: "./loaders/07_babel_loader.js",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      // file_loader
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        loader: "./loaders/08_file_loader.js",
        type: "javascript/auto", // 解决图片重复打包问题，即阻止webpack默认处理图片资源的行为
      },
      // 样式相关loader
      {
        test: /\.css$/i, // 只检测.css文件
        // loader的执行顺序是：从右到左（从下到上），先css-loader，再style-loader
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
  ],
};
