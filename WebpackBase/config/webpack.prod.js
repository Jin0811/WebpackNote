const path = require("path");

// Plugins
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 封装一个方法，用于抽取样式loader当中公共的部分，简化配置项
const getStyleLoader = (preLoader) => {
  // preLoader如果未传递，是一个undefined，会通过[]..filter(Boolean)过滤掉
  return [
    // style-loader会将js中的css通过创建style标签的形式添加到页面当中
    // 这里使用MiniCssExtractPlugin.loader，抽取CSS成单独的文件，通过link标签的形式添加到页面上
    MiniCssExtractPlugin.loader,
    "css-loader", // css-loader会将css资源编译成commonjs的一个模块到js当中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preLoader,
  ].filter(Boolean);
};

module.exports = {
  // 模式 mode
  mode: "production", // development | production

  // 入口 entry
  entry: "./src/main.js",

  // 输出 output
  output: {
    // 文件的输出路径，借助path，编写绝对路径
    // __dirname是node当中的变量，代表当前文件的文件夹根目录
    path: path.resolve(__dirname, "../dist"),

    filename: "static/js/[name].js", // 输出的文件名称，这里修改了入口js文件的存放目录

    // /* webpackChunkName: "count" */ 是webpack的魔法命名，可以为动态导入的模块命名
    // 此外还需要在webpack配置文件当中添加以下配置：
    // output.chunkFilename: "static/js/[name].chunk.js"
    // 添加.chunk是为了更好的区分哪些是动态文件
    chunkFilename: "static/js/[name].chunk.js",

    // 对type: asset的文件（图片、字体、音频、视频、Excel、Word等）统一命名
    // 这样就不需要在下面每个loader当中配置了，统一都放在了 static/media 目录当中
    assetModuleFilename: "static/media/[hash:8][ext][query]",

    clean: true, // 在每次构建前清理/dist文件夹，即每次打包的时候，将output.path目录清空
  },

  // 加载器 loader
  module: {
    rules: [
      // 样式相关loader
      {
        test: /\.css$/i, // 只检测.css文件
        use: getStyleLoader(), // loader的执行顺序是：从右到左（从下到上），先css-loader，再style-loader
      },
      {
        test: /\.less$/i,
        // loader: "xxx",
        use: getStyleLoader("less-loader"),
      },
      {
        test: /\.s[ac]ss$/i,
        use: getStyleLoader("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoader("stylus-loader"),
      },

      // 处理图片资源，针对小图片进行Base64转换
      {
        test: /\.(png|jpe?g|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            // 小于20kb的图片转换为Base64
            // 优点：减少请求数量
            // 缺点：体积会比之前大一些
            maxSize: 20 * 1024,
          },
        },
        // 修改图片资源的输出目录和名称，如果不修改的话，全部的资源都会放在dist中，比较混乱
        // [hash:8]: hash值取8位，[hash]默认为20位
        // [ext]: 使用之前的文件扩展名
        // [query]: 添加之前的query参数
        // [name]: 资源原来的名称
        // 已使用 assetModuleFilename 进行了统一命名
        // generator: {
        //   filename: "static/images/[hash:8][ext][query]",
        // },
      },

      // 处理fonts
      {
        test: /\.(ttf|woff2?)$/,
        // asset会将小于一定大小的资源转换为Base64，字体资源不需要转换
        // 这里使用asset/resource，发送一个单独的文件并导出URL，即原封不动对文件进行输出
        type: "asset/resource",
        // 修改输出目录和名称
        // 已使用 assetModuleFilename 进行了统一命名
        // generator: {
        //   filename: "static/images/[hash:8][ext][query]",
        // },
      },

      // 处理其他资源，譬如：音频、视频、Excel、Word等
      // 这些资源无需特殊处理，原封不动输出即可，此配置可以与上方的处理fonts配置项合并
      // 为了更加清晰明了，这里单独进行了一个配置
      {
        test: /\.(map3|map4|avi|xlsx|doc|docx)$/,
        // asset会将小于一定大小的资源转换为Base64，字体资源不需要转换
        // 这里使用asset/resource，发送一个单独的文件并导出URL，即原封不动对文件进行输出
        type: "asset/resource",
        // 修改输出目录和名称
        // 已使用 assetModuleFilename 进行了统一命名
        // generator: {
        //   filename: "static/images/[hash:8][ext][query]",
        // },
      },

      // babel-loader
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules当中的js文件，这些文件无需处理
        use: {
          loader: "babel-loader",
        },
        // options.presets预设等配置项建议在babel.config.js文件当中进行配置，统一管理
        // options: { presets: ["@babel/preset-env"] },
      },
    ],
  },

  // 插件 plugin
  plugins: [
    // Eslint
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"), // 指定需要检查的目录
    }),
    // HTML自动引入打包后的资源
    new HtmlWebpackPlugin({
      // 指定模板文件
      // 新的HTML文件的特点：1、结构和模板文件一致 2、会自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    // 提取CSS成单独文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].css",
      chunkFilename: "static/css/[name].chunk.css", // 对动态导出的CSS文件进行命名
    }),
    // 压缩CSS
    new CssMinimizerPlugin(),
  ],

  optimization: {
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
  },
};
