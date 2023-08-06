# Loader

帮助 webpack 将不同类型的文件转换为 webpack 可识别的模块

loader 就是一个函数，当 webpack 解析资源的时候，会调用相应的 loader 去处理资源，loader 接收文件内容作为参数，需要返回内容出去

## 1 loader 执行顺序

分类

- pre： 前置 loader
- normal： 普通 loader
- inline： 内联 loader
- post： 后置 loader

执行顺序

- 四类 loader 的执行优级为：pre > normal > inline > post 。
- 相同优先级的 loader 执行顺序为：从右到左，从下到上。

使用 loader 的方式

- 配置方式：在 webpack.config.js 文件中指定 loader。（pre、normal、post loader）

- 内联方式：在每个 import 语句中显式指定 loader。（inline loader）
  inline loader

  ```js
  import Styles from "style-loader!css-loader?modules!./styles.css";
  ```

含义：

- 使用 css-loader 和 style-loader 处理 styles.css 文件
- 通过 ! 将资源中的 loader 分开
  inline loader 可以通过添加不同前缀，跳过其他类型 loader

- ! 跳过 normal loader

  ```js
  import Styles from "!style-loader!css-loader?modules!./styles.css";
  ```

- -! 跳过 pre 和 normal loader

  ```js
  import Styles from "-!style-loader!css-loader?modules!./styles.css";
  ```

- !! 跳过 pre、 normal 和 post loader
  ```js
  import Styles from "!!style-loader!css-loader?modules!./styles.css";
  ```

## loader API

| 方法名                  | 含义                                       | 用法                                           |
| ----------------------- | ------------------------------------------ | ---------------------------------------------- |
| this.async              | 异步回调 loader。返回 this.callback        | const callback = this.async()                  |
| this.callback           | 可以同步或者异步调用的并返回多个结果的函数 | this.callback(err, content, sourceMap?, meta?) |
| this.getOptions(schema) | 获取 loader 的 options                     | this.getOptions(schema)                        |
| this.emitFile           | 产生一个文件                               | this.emitFile(name, content, sourceMap)        |
| this.utils.contextify   | 返回一个相对路径                           | this.utils.contextify(context, request)        |
| this.utils.absolutify   | 返回一个绝对路径                           | this.utils.absolutify(context, request)        |

更多文档，请查阅 [webpack 官方 loader api 文档](https://webpack.docschina.org/api/loaders/#the-loader-context)