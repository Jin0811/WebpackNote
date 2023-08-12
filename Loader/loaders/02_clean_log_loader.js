/**
 * @name clean-log-loader
 * @description 清除项目中的console.log()
 */

module.exports = function (content, map, meta) {
  return content.replace(/console\.log\(.*\);?/g, "");
};
