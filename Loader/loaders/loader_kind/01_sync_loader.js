/**
 * 同步loader
 */

module.exports = function (content, map, meta) {
  console.log("同步loader");

  /**
   * this.callback
   * 第一个参数：错误信息，null或者是具体的报错信息
   * 第二个参数：文件内容
   * 第三个参数：SourceMap
   * 第四个参数：meta
   */
  this.callback(null, content, map, meta);
};
