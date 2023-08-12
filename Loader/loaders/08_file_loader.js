/**
 * file_loader
 * 需要处理的是图片、字体等文件，它们都是buffer数据，所以需要使用raw loader
 */

const loaderUtils = require("loader-utils");

module.exports = function (content) {
  // 1、根据文件内容去生成hash值文件名
  const fileName = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content,
  });

  // 2、将文件输出出去
  this.emitFile(fileName, content);

  // 3、返回 module.exports = "文件路径";
  return `module.exports = "${fileName}"`
};

module.exports.raw = true;
