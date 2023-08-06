# Webpack Base

## 1 教程地址

- [哔哩哔哩视频](https://www.bilibili.com/video/BV14T4y1z7sw/?vd_source=3284d439dd5569b325f17bd1d33a1739)
- [在线文档](https://yk2012.github.io/sgg_webpack5/)
- [Webpack5 资料，提取码：yyds](https://pan.baidu.com/s/114lJRGua2uHBdLq_iVLOOQ)

## 2 Webpack 五大核心概念

- entry 入口
- output 输出
- loader 加载器
- plugins 插件
- mode 模式
  - 开发模式 development
    - 开发模式就是我们开发代码时使用的模式，会编译代码，使得浏览器可以识别和运行代码，其次会进行代码质量检查，树立代码规范
  - 生产模式 production

开发模式下，webpack 仅能编译 ES6 的模块化语法，不能编译 ES6 的其他语法，譬如 reduce 等

生产模式下，webpack 会编译 ES6 的模块化和 ES6 的语法，并且会压缩代码

## 3 安装和执行 webapck

```js
// 安装教程当中的版本
npm i webpack@5.72.0 -D
npm i webpack-cli@4.10.0 -D

// 执行打包【未配置webpack.config.js】
npx webpack ./src/main.js --mode=development
npx webpack ./src/main.js --mode=production

// 执行打包【已配置webpack.config.js】
npx webpack

// 安装和配置好webpack-dev-server后执行以下命令可以开启本地服务器，自动打包刷新
npx webpack serve

// 打包时指定所使用的webpack配置文件
npx webpack serve --config ./config/webpack.dev.js
npx webpack --config ./config/webpack.prod.js

// 为了执行命令更加方便和快捷，可以在package.json当中进行命令的配置
"scripts": {
  "start": "npm run dev",
  "dev": "npx webpack serve --config ./config/webpack.dev.js",
  "build": "npx webpack --config ./config/webpack.prod.js"
},
```

## 4 注意项

- `webpack.config.js`需要放在项目的根目录下
- webpack 本身无法识别样式资源，所以我们需要借助 loader 来帮助 webpack 解析样式资源 [点击访问官方的 loader 文档](https://webpack.docschina.org/loaders)
- loader 的执行顺序是：从右到左（从下到上）
- module.rules 当中，loader 只能使用一个 loader，而 use 可以使用多个 loader
- webpack4 当中，处理图片资源的时候需要用到`file-loader`和`url-loader`，在 webpack5 当中，这两个功能内置到了 webpack 当中，可以直接进行打包，也可以进行优化配置
- 按照视频教程的版本，在安装和配置好 webpack-dev-server 后，执行`npx webpack serve`可能会报错，此时需要升级`webpack-cli`的版本，执行`npm install webpack-cli@4.10.0 --save-dev`
- 生产模式下，webpack 默认就会对 HTML 和 JS 代码进行压缩，CSS 的压缩需要配置`css-minimizer-webpack-plugin`

## 5 Loader 安装

- [css-loader](https://webpack.docschina.org/loaders/css-loader/)
  ```js
  // 文档当中只让安装了css-loader，但是打包报错，还需要安装style-loader
  npm install --save-dev css-loader
  npm install style-loader -D
  ```
- [less-loader](https://webpack.docschina.org/loaders/less-loader/)
  ```js
  // 注意：这里安装了less和less-loader
  npm install less less-loader --save-dev
  ```
- [sass-loader](https://webpack.docschina.org/loaders/sass-loader/)
  ```js
  // 注意：这里安装了sass和sass-loader
  npm install sass-loader sass --save-dev
  ```
- [stylus-loader](https://webpack.docschina.org/loaders/stylus-loader/)
  ```js
  // 注意：这里安装了stylus和stylus-loader
  npm install stylus stylus-loader --save-dev
  ```
- [babel-loader](https://www.webpackjs.com/loaders/babel-loader/)
  ```js
  npm install babel-loader -D
  npm install @babel/core -D
  npm install @babel/preset-env -D
  ```

## 6 Plugins 安装

- [eslint-webpack-plugin](https://www.webpackjs.com/plugins/eslint-webpack-plugin/)
  ```js
  // 安装eslint-webpack-plugin和eslint
  npm install eslint-webpack-plugin --save-dev
  npm install eslint --save-dev
  ```
- [html-webpack-plugin](https://www.webpackjs.com/plugins/html-webpack-plugin/)
  ```js
  npm install html-webpack-plugin --save-dev
  ```

## 7 webpack-dev-server 安装

```js
npm install --save-dev webpack-dev-server
```

## 8 webpack 优化

### 8.1 抽取 CSS 成单独文件

目前 CSS 文件是被打包到了 JS 文件当中，当 JS 文件加载时，会创建一个 style 标签来生成样式，这样对于网站来说，会出现闪屏现象，用户体验不好，可以将 CSS 抽取为一个单独的文件，通过 link 加载

```js
// 安装mini-css-extract-plugin
npm install --save-dev mini-css-extract-plugin
```

### 8.2 处理图片资源

优化思路：项目当中的每一张图片都需要发送一个网络请求，比较消耗带宽，我们可以考虑把某些图片转换为 Base64 形式的，这样就减少了网络请求；图片转换为 Base64 之后，体积会变大，越大的图片，转换为 Base64 之后的体积，就越大，所以我们只需要对小图片进行 Base64 转换，对大的图片不进行转换

```js
module: {
  rules: [
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
    },
  ]
},
```

### 8.3 CSS 兼容性处理

```js
// 安装相关依赖
// https://www.webpackjs.com/loaders/postcss-loader
// https://yk2012.github.io/sgg_webpack5/base/optimizeCss.html#css-%E5%85%BC%E5%AE%B9%E6%80%A7%E5%A4%84%E7%90%86
npm i postcss-loader -D
npm i postcss -D
npm i postcss-preset-env -D

// module.rules当中的样式相关配置
// 放置到css-loader的下面（后面）
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

// 在package.json的browserslist字段中配置需要支持的浏览器信息
{
  "browserslist": ["ie >= 8"]
}
// 实际开发中我们一般不考虑旧版本浏览器了，所以我们可以这样设置：
{
  "browserslist": [
    "last 2 version", // 所有浏览器最近的两个版本
    "> 1%", // 覆盖99%的浏览器，排除很冷门的浏览器
    "not dead", // 排除某些浏览器已经废弃的版本
  ]
}
```

### 8.4 CSS 压缩处理

```js
// https://yk2012.github.io/sgg_webpack5/base/optimizeCss.html#css-%E5%8E%8B%E7%BC%A9
// https://www.webpackjs.com/plugins/css-minimizer-webpack-plugin/
npm install css-minimizer-webpack-plugin --save-dev
```
