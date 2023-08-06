/**
 * loader 就是一个函数，当 webpack 解析资源的时候，会调用相应的 loader 去处理资源
 * loader 接收文件内容作为参数，需要返回内容出去
 *
 * @param {String} content 文件内容
 * @param {*} map SourceMap
 * @param {*} meta 其他loader传递过来的数据
 * @returns
 */

module.exports = function (content, map, meta) {
  console.log(content);
  return content;
};
