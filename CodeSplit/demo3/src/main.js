import { sum } from "./math";

console.log("main.js");
console.log(sum(1, 2, 3));

// 非按需导入，非动态加载
// import { count } from "./count";
// document.getElementById("btn").onclick = function () {
//   console.log(count(2, 1));
// };

// 按需导入，动态加载
document.getElementById("btn").onclick = function () {
  // /* webpackChunkName: "count" */ 是webpack的魔法命名，可以为动态导入的模块命名
  // 此外还需要在webpack配置文件当中添加以下配置：
  // output.chunkFilename: "static/js/[name].chunk.js"
  // 添加.chunk是为了更好的区分哪些是动态文件
  import(/* webpackChunkName: "count" */"./count")
    .then((res) => {
      console.log("模块动态加载成功", res);
      console.log(res.count(2, 1));
    })
    .catch((err) => {
      console.log("模块动态加载失败", err);
    });
};
