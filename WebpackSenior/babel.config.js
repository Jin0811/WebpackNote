module.exports = {
  // presets是预设，简单理解就是一组Babel插件, 扩展Babel的功能
  presets: [
    [
      // 智能预设，可以编译ES6语法
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],
  ],
};
