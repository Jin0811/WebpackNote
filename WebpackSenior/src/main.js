// JavaScript
import count from "./js/count";
import sum from "./js/sum";

// CSS
import "./css/index.css";
// Less
import "./less/index.less";
// Scss
import "./scss/index.scss";
// Stylus
import "./stylus/index.styl";
// 公共样式，编写了一些样式，以便更好地展示效果
import "./commonStyle/index.less";

// Fonts
import "./fonts/iconfont.css";

const result1 = count(2, 1);
const result2 = sum(1, 2, 3);
console.log(result1);
console.log(result2);

// 按需导入，动态加载
document.getElementById("btn").onclick = function () {
  // /* webpackChunkName: "math" */ 是webpack的魔法命名，可以为动态导入的模块命名
  // 此外还需要在webpack配置文件当中添加以下配置：
  // output.chunkFilename: "static/js/[name].chunk.js"
  // 添加.chunk是为了更好的区分哪些是动态文件
  // 这里使用动态导入的语法，eslint不能识别，解决方案参考：https://www.it1352.com/1558571.html
  import(/* webpackChunkName: "math" */"./js/math")
    .then((res) => {
      console.log("模块动态加载成功", res);
      console.log(res.math(2, 1));
    })
    .catch((err) => {
      console.log("模块动态加载失败", err);
    });
};

// 目前使用了babel来进行了ES6代码的转换，但是对于promise等新特性，babel无法进行处理，此时就需要配置相关polyfill
const pInstance = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(123);
  }, 1000);
});
pInstance.then((res) => {
  console.log(res);
}).catch((err) => {
  console.log(err);
});
