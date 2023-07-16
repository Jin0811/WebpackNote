const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // entry 入口
  entry: {
    app: "./src/app.js",
    main: "./src/main.js",
  },

  // output 输入
  output: {
    path: path.resolve(__dirname, "dist"),
    // webpack命名方式，[name]以文件原先的名称命名，即entry当中的key
    // 什么是chunk？打包的资源就是chunk，输出出去叫bundle
    // chunk的name是啥呢？ 比如：entry中xxx: "./src/xxx.js", name就是xxx，注意是前面的xxx，和文件名无关
    filename: "[name].js",
    clean: true, // 在每次构建前清理/dist文件夹，即每次打包的时候，将output.path目录清空
  },

  // plugins 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],

  // mode 模式
  mode: "production",
};
