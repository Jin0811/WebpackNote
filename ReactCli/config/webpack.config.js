/**
 * 开发模式和生产模式合并之后的配置，使用一个配置同时支持开发和生产
 * 代码的复用程度更高，维护起来比较方便
 */

const path = require("path");

// Plugins
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// 判断是否为生产模式
const isProduction = process.env.NODE_ENV === "production";

// 封装一个方法，用于抽取样式loader当中公共的部分，简化配置项
const getStyleLoader = (preLoader) => {
  // preLoader如果未传递，是一个undefined，会通过[]..filter(Boolean)过滤掉
  return [
    // style-loader会将js中的css通过创建style标签的形式添加到页面当中
    // "style-loader",
    // 这里生产模式下，使用MiniCssExtractPlugin.loader，抽取CSS成单独的文件，通过link标签的形式添加到页面上
    // MiniCssExtractPlugin.loader,
    isProduction ? MiniCssExtractPlugin.loader : "style-loader",
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
  mode: isProduction ? "production" : "development", // development | production

  // SourceMap配置，开发模式和生产模式使用不同的配置
  devtool: isProduction ? "source-map" : "cheap-module-source-map",

  entry: "./src/main.js",

  output: {
    path: isProduction ? path.resolve(__dirname, "../dist") : undefined,
    filename: isProduction
      ? "static/js/[name].[contenthash:10].js"
      : "static/js/[name].js",
    chunkFilename: isProduction
      ? "static/js/[name].[contenthash:10].chunk.js"
      : "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
    clean: true,
  },

  module: {
    rules: [
      {
        oneOf: [
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
            test: /\.jsx?$/,
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
                  plugins: [
                    !isProduction && "react-refresh/babel", // react项目当中开启JS的HMR功能
                  ].filter(Boolean),
                },
              },
            ],
          },
        ],
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
      title: "ReactCli", // HTML文档的标题
    }),
    // 提取CSS成单独文件
    isProduction && new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css", // 对动态导出的CSS文件进行命名
    }),
    // 将public下面的资源复制到dist目录去（除了index.html）
    isProduction && new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          globOptions: {
            ignore: ["**/index.html"], // 忽略文件，index.html不需要复制过去
          },
        },
      ],
    }),
    !isProduction && new ReactRefreshWebpackPlugin(), // 处理JS的HMR功能
  ].filter(Boolean),

  optimization: {
    minimize: isProduction, // 是否需要进行压缩，默认为true，为true的时候，minimizer才会进行工作
    minimizer: [
      // 压缩CSS
      new CssMinimizerPlugin(),
      // 压缩JS，使用webpack内置的压缩代码插件
      new TerserPlugin(),
    ],
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
    extensions: [".jsx", ".js", ".json"], // 自动补全文件扩展名
  },

  devServer: {
    host: "localhost", // 启动的服务器域名
    port: "3000", // 启动的服务器端口
    open: true, // 是否自动打开浏览器
    // 开启HotModuleReplacement（热模块替换）默认值为true
    // 开发模式下，我们使用style-loader支持了CSS的热更新；但是react、vue的组件和模块，是无法进行热更新的
    // 我们可以在每一个模块里面去判断module.hot，再进行module.hot.accept来实现热更新，但是这样太麻烦了
    // 实际项目当中，react和vue都提供了相关的库，来实现热更新
    hot: true,
    historyApiFallback: true, // 解决react-router刷新404问题
  },
};
