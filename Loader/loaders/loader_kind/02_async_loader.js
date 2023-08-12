/**
 * 异步loader
 */

module.exports = function (content, map, meta) {
  const callback = this.async(); // 使用this.async获取一个回调函数
  setTimeout(() => {
    console.log("异步loader");

    /**
     * this.callback
     * 第一个参数：错误信息，null或者是具体的报错信息
     * 第二个参数：文件内容
     * 第三个参数：SourceMap
     * 第四个参数：meta
     */
    callback(null, content, map, meta);
  }, 2000);
};
