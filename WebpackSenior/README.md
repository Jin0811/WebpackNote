# Webpack Senior

## 1 注意事项

- SourceMap 需要区分开发模式和生产模式
- HotModuleReplacement 只需在开发模式下配置，生产模式不需要

## 2 SourceMap

SourceMap（源代码映射）是一个用来生成源代码与构建后代码一一映射的文件的方案，它会生成一个 xxx.map 文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过 xxx.map 文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源

[Webpack DevTool 文档](https://webpack.docschina.org/configuration/devtool/)

```js
// 开发模式：cheap-module-source-map
// 优点：打包编译速度快，只包含行映射
// 缺点：没有列映射
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
};

// 生产模式：source-map
// 优点：包含行/列映射
// 缺点：打包编译速度更慢
module.exports = {
  mode: "production",
  devtool: "source-map",
};
```

# 3 HotModuleReplacement

HotModuleReplacement（HMR/热模块替换）：在程序运行中，替换、添加或删除模块，而无需重新加载整个页面

我们需要做到修改某个模块代码，就只有这个模块代码需要重新打包编译，其他模块不变，这样打包速度就能很快，这就是 HotModuleReplacement 所解决的问题

配置了`devServer.hot`之后，可以实现 CSS 的热模块替换，JS 想要实现热模块替换，还需要进行配置。实际开发我们会使用其他 loader 来解决，譬如`vue-loader`、`react-hot-loader`

```js
devServer: {
  // 开启HotModuleReplacement（热模块替换）
  // 只需要在开发环境下配置，生产环境下不需要
  // 默认值为true
  hot: true,
},

// 在src/main.js配置JS热模块替换
// 下方配置的意思：如果下面这两个模块的其中任何一个发生变化，就只更新这两个模块，其他模块不进行编译打包
if (module.hot) {
  module.hot.accept("./js/count.js");
  module.hot.accept("./js/sum.js");
}
```

## 4 oneOf

在配置 loader 的时候，每一种文件只会被一个 loader 处理，但是会过一遍全部的 loader，比较慢，可以使用 oneOf 来实现匹配到一个 loader 之后，后续 loader 不再匹配的功能

```js
module: {
  rules: [
    {
      oneOf: [
        // loader配置项
      ],
    }
  ],
},
```

## 5 Include/Exclude

开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要 Babel 编译和 eslint 校验，可以直接使用的。所以我们在对 js 文件处理时，要排除 node_modules 下面的文件

- include 包含，只处理 xxx 文件
- exclude 排除，除了 xxx 文件以外其他文件都处理

注意：include 和 exclude 只能使用其中之一

```js
// 加载器 loader
module: {
  rules: [
    {
      oneOf: [
        // babel-loader
        {
          test: /\.js$/,
          exclude: /node_modules/, // 排除node_modules当中的js文件，这些文件无需处理
          // include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不作处理
          use: {
            loader: "babel-loader",
          },
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
  }),
],
```

## 6 Cache

在每一次进行打包时，Babel 和 Eslint 都会对全部的文件进行编译和检查，这样速度比较慢，我们可以将之前编译和检查的结果进行缓存，只对修改的文件进行处理，这样可以加快打包的速度

```js
// babel开启缓存，设置cacheDirectory和cacheCompression属性
// babel-loader
{
  test: /\.js$/,
  exclude: /node_modules/, // 排除node_modules当中的js文件，这些文件无需处理
  // include: path.resolve(__dirname, "../src"), // 只处理src下的文件，其他文件不作处理
  use: {
    loader: "babel-loader",
  },
  options: {
    // options.presets预设等配置项建议在babel.config.js文件当中进行配置，统一管理
    // presets: ["@babel/preset-env"]
    cacheDirectory: true, // 开启babel缓存
    cacheCompression: false, // 关闭缓存文件压缩，即不压缩缓存文件
  },
},

// eslint开启缓存，在ESLintPlugin当中设置cache和cacheLocation
// 插件 plugin
plugins: [
  new ESLintPlugin({
    context: path.resolve(__dirname, "../src"), // 指定需要检查的目录
    exclude: "node_modules", // 对node_modules不作处理，默认值为node_modules
    cache: true, // 开启缓存
    cacheLocation: path.resolve(__dirname, "../node_modules/.cache/eslintcache"), // 缓存目录
  }),
  new HtmlWebpackPlugin({
    // 指定模板文件
    // 新的HTML文件的特点：1、结构和模板文件一致 2、会自动引入打包输出的资源
    template: path.resolve(__dirname, "../public/index.html"),
  }),
],
```
