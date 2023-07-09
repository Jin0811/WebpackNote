# Webpack Senior

## 1 SourceMap

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
