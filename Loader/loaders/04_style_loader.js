/**
 * style_loader
 */

module.exports = function (content) {
  /**
    const script = `
      const styleElement = document.createElement("style");
      styleElement.innerHTML = ${JSON.stringify(content)};
      document.head.appendChild(styleElement);
    `;

    1、use: ["./loaders/09_style_loader.js"]
    直接使用style-loader只能处理样式，不能处理样式当中引入的其他资源

    2、use: ["./loaders/09_style_loader.js", "css-loader"]
    借助css-loader来解决样式当中引入的其他资源不能被解析的问题
    这样带来了新的问题，css-loader暴露的一个JS代码
    style-loader需要执行JS代码，得到结果之后再动态创建style标签，插入到页面上

    3、style-loader使用pitch loader的写法解决
   */
};

/**
 * @param {String} remainingRequest 剩下还需要处理的loader
 */
module.exports.pitch = function (remainingRequest) {
  // 1、将remainingRequest的绝对路径修改为相对路径，因为后续只能使用相对路径进行操作
  // D:\WorkSpace\WebpackNote\Loader\node_modules\css-loader\dist\cjs.js!D:\WorkSpace\WebpackNote\Loader\src\css\index.css
  const relativePath = remainingRequest
    .split("!")
    .map((path) => {
      return this.utils.contextify(this.context, path);
    })
    .join("!");

  // 2、引入css-loader处理后的资源，再动态创建style标签，插入到页面上
  const script = `
    import style from "!!${relativePath}";
    const styleElement = document.createElement("style");
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  `;
  
  // 当use多个loader时，其中的某一个pitch loader进行了return
  // 则后续全部的pitch loader和normal loader，除了已经执行通过的pitch所对应的normal loader，其他的都不会再执行
  return script;
};
