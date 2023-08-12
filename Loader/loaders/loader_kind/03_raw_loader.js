/**
 * raw loader
 * 与同步loader的区别在于，接收到的content是Buffer数据
 *
 * 注意：
 * raw loader 一般用于处理图片、字体、图标等资源
 * raw loader 内部可以使用同步或者异步的写法
 */

module.exports = function (content, map, meta) {
  console.log("raw loader", content);
  return content;
};
module.exports.raw = true;

// 另外一个写法
// function TestRawLoader(content, map, meta) {
//   return content;
// }
// TestRawLoader.raw = true;
// module.exports = TestRawLoader;
