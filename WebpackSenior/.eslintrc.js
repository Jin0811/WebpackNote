module.exports = {
  extends: ["eslint:recommended"], // 继承 Eslint 规则
  env: {
    node: true, // 启用node中全局变量
    browser: true, // 启用浏览器中全局变量
  },
  parser: "babel-eslint", // 指定解析器
  parserOptions: {
    ecmaVersion: 6, // 支持的 ECMAScript 版本
    sourceType: "module", // JS源代码的类型，"module"用于ECMAScript模块(ESM)
    allowImportExportEverywhere: true, // 允许import和export出现在任何地方
  },
  rules: {
    /**
     * "off" 或 0 - 关闭规则
     * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
     * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
     */
    "no-var": 2, // 不能使用 var 定义变量
  },
};
