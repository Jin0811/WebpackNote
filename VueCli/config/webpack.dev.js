const path = require("path");

// Plugins
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");

// 封装一个方法，用于抽取样式loader当中公共的部分，简化配置项
const getStyleLoader = (preLoader) => {
  // preLoader如果未传递，是一个undefined，会通过[]..filter(Boolean)过滤掉
  return [
    // vue项目当中，需要使用vue-style-loader来处理样式，无法使用style-loader
    // "style-loader",
    "vue-style-loader",
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
  mode: "development", // development | production

  // SourceMap配置，开发模式和生产模式使用不同的配置
  devtool: "cheap-module-source-map",

  entry: "./src/main.js",

  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
  },

  module: {
    rules: [
      // 处理CSS
      {
        test: /\.css$/i, // 只检测.css文件
        use: getStyleLoader(),
      },
      {
        test: /\.less$/i,
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
      // 处理图片
      {
        test: /\.(png|jpe?g|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片转换为Base64
          },
        },
      },
      // 处理fonts
      {
        test: /\.(ttf|woff2?)$/,
        // asset会将小于一定大小的资源转换为Base64，字体资源不需要转换
        // 这里使用asset/resource，发送一个单独的文件并导出URL，即原封不动对文件进行输出
        type: "asset/resource",
      },
      // 处理其他资源，譬如：音频、视频、Excel、Word等
      // 这些资源无需特殊处理，原封不动输出即可，此配置可以与上方的处理fonts配置项合并
      // 为了更加清晰明了，这里单独进行了一个配置
      {
        test: /\.(map3|map4|avi|xlsx|doc|docx)$/,
        // asset会将小于一定大小的资源转换为Base64，但是有些资源不需要转换
        // 这里使用asset/resource，发送一个单独的文件并导出URL，即原封不动对文件进行输出
        type: "asset/resource",
      },
      // 处理JS babel-loader
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules当中的js文件，这些文件无需处理
        // include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不作处理
        use: [
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
      // vue-loader不支持oneOf
      {
        test: /\.vue$/,
        loader: "vue-loader", // 内部会给vue文件注入HMR功能代码
        options: {
          // 开启缓存
          cacheDirectory: path.resolve(
            __dirname,
            "node_modules/.cache/vue-loader"
          ),
        },
      },
    ],
  },

  plugins: [
    // Eslint
    new ESLintPlugin({
      context: path.resolve(__dirname, "../src"), // 指定需要检查的目录
      exclude: "node_modules", // 对node_modules不作处理，默认值为node_modules
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/eslintcache"
      ), // 缓存目录
    }),
    // HTML自动引入打包后的资源
    new HtmlWebpackPlugin({
      // 指定模板文件
      // 新的HTML文件的特点：1、结构和模板文件一致 2、会自动引入打包输出的资源
      template: path.resolve(__dirname, "../public/index.html"),
      title: "VueCli", // HTML文档的标题
    }),
    // vue项目当中处理样式
    new VueLoaderPlugin(),
    // 解决vue项目控制台警告，定义相关环境变量，这些变量用于代码当中
    // cross-env定义的变量是给webpack使用的，代码当中无法使用
    new DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],

  optimization: {
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
    },
    // 提取runtime文件
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // runtime文件命名规则
    },
  },

  // webpack解析模块的时候加载的选项
  resolve: {
    extensions: [".vue", ".js", ".json", ".vue"], // 自动补全文件扩展名
  },

  // webpack-dev-server配置开发服务器，不会输出资源，是在内存当中进行编译打包的
  devServer: {
    host: "localhost", // 启动的服务器域名
    port: "3000", // 启动的服务器端口
    open: true, // 是否自动打开浏览器
    // 开启HotModuleReplacement（热模块替换）默认值为true
    // 开发模式下，我们使用style-loader支持了CSS的热更新；但是react、vue的组件和模块，是无法进行热更新的
    // 我们可以在每一个模块里面去判断module.hot，再进行module.hot.accept来实现热更新，但是这样太麻烦了
    // 实际项目当中，react和vue都提供了相关的库，来实现热更新
    hot: true,
    historyApiFallback: true, // 解决路由刷新404问题
  },
};
