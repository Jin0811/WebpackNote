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