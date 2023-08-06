/**
 * Pitching loader
 *
 * loader的执行顺序是从下到上，从右到左
 * 而pitch的执行顺序是从上到下，从左到右
 * loader和pitch的执行顺序是相反的
 * 
 * 执行顺序图：
 * normal-1   =>  normal-2  =>  normal-3
 *                                 ^
 *                                 |
 * pitch-1    =>  pitch-2   =>  pitch-3
 * 
 * 当use多个loader时，其中的某一个pitch loader进行了return
 * 则后续全部的pitch loader和normal loader，除了已经执行通过的pitch所对应的normal loader，其他的都不会再执行
 * 以上图为例，pitch-2进行了return后，后续的pitch-3、normal-3、normal-2都不会再执行了，而是直接执行normal-1
 * 
 */

module.exports = function (content, map, meta) {
  return content;
};

module.exports.pitch = function () {
  console.log("04_pitching-loader pitch函数");
};
