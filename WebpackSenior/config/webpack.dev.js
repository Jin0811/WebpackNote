const path = require("path");
const os = require("os");

// Plugins
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const threads = os.cpus().length; // 获取CPU的核数

module.exports = {
  // 模式 mode
  mode: "development", // development | production

  // SourceMap配置，开发模式和生产模式使用不同的配置
  devtool: "cheap-module-source-map",

  // 入口 entry
  // 开发模式下，虽然webpack.dev.js在config文件当中，无法访问到./src/main.js
  // 但是执行命令的时候，我们是在根目录当中执行的，所以下面的路径是正确的，无需修改
  // 相对路径，相对的是我们执行命令的那个目录
  entry: "./src/main.js",

  // 输出 output
  output: {
    path: undefined, // 开发模块下没有输出，不需要配置path
    filename: "static/js/main.js", // 输出的文件名称，这里修改了入口js文件的存放目录
    clean: true, // 在每次构建前清理/dist文件夹，即每次打包的时候，将output.path目录清空
  },

  // 加载器 loader
  module: {
    rules: [
      {
        oneOf: [
          // 样式相关loader
          {
            test: /\.css$/i, // 只检测.css文件
            // loader的执行顺序是：从右到左（从下到上），先css-loader，再style-loader
            use: [
              "style-loader", // style-loader将js中的css通过创建style标签的形式添加到页面当中
              "css-loader", // css-loader会将css资源编译成commonjs的一个模块到js当中
            ],
          },
          {
            test: /\.less$/i,
            // loader: "xxx",
            use: ["style-loader", "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              "style-loader", // 将 JS 字符串生成为 style 节点
              "css-loader", // 将 CSS 转化成 CommonJS 模块
              "sass-loader", // 将 Sass 编译成 CSS
            ],
          },
          {
            test: /\.styl$/,
            use: ["style-loader", "css-loader", "stylus-loader"],
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
            generator: {
              filename: "static/images/[hash:8][ext][query]",
            },
          },

          // 处理fonts
          {
            test: /\.(ttf|woff2?)$/,
            // asset会将小于一定大小的资源转换为Base64，字体资源不需要转换
            // 这里使用asset/resource，发送一个单独的文件并导出URL，即原封不动对文件进行输出
            type: "asset/resource",
            // 修改输出目录和名称
            generator: {
              filename: "static/media/[hash][ext][query]",
            },
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
            generator: {
              filename: "static/media/[hash][ext][query]",
            },
          },

          // babel-loader
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules当中的js文件，这些文件无需处理
            // include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不作处理
            use: [
              // thread-loader开启多进程打包
              {
                loader: "thread-loader",
                options: {
                  works: threads, // 进程数量，设置进程数量，有多少个CPU就开启几个进程
                },
              },
              {
                loader: "babel-loader",
                options: {
                  // options.presets预设等配置项建议在babel.config.js文件当中进行配置，统一管理
                  // presets: ["@babel/preset-env"]
                  cacheDirectory: true, // 开启babel缓存
                  // cacheCompression 默认为 true，将缓存内容压缩为 gz 包以减⼩缓存⽬录的体积。在设为 false 的情况下将跳过压缩和解压的过程，从⽽提升这⼀阶段的速度
                  // 即不对babel的文件进行压缩，这样虽然会占用多一点的电脑空间，但是提升了速度
                  cacheCompression: false,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  // 插件 plugin
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"), // 指定需要检查的目录
      exclude: "node_modules", // 对node_modules不作处理，默认值为node_modules
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ), // 缓存目录
      threads, // 开启eslint的多进程打包，设置进程数量
    }),
    new HtmlWebpackPlugin({
      // 指定模板文件
      // 新的HTML文件的特点：1、结构和模板文件一致 2、会自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],

  // webpack-dev-server配置开发服务器，不会输出资源，是在内存当中进行编译打包的
  devServer: {
    host: "localhost", // 启动的服务器域名
    port: "3000", // 启动的服务器端口
    open: true, // 是否自动打开浏览器
    // 开启HotModuleReplacement（热模块替换）
    // 只需要在开发环境下配置，生产环境下不需要
    // 默认值为true
    hot: true,
  },
};
