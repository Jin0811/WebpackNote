module.exports = {
  // presets是预设，简单理解就是一组Babel插件, 扩展Babel的功能
  presets: [
    [
      // 智能预设，可以编译ES6语法
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      {
        // 需要兼容的浏览器配置已经在package.json当中进行了配置，这里就无需配置了
        // 这里为了演示core-js的兼容性处理，设置需要兼容ie10浏览器
        // targets: { chrome: "88", ie: "10" },
        useBuiltIns: "usage",
        corejs: {
          version: "3",
          proposals: true,
        },
      },
    ],
  ],
};
