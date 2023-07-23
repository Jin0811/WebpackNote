module.exports = {
  extends: ["react-app"], // 继承 react 官方规则
  parserOptions: {
    babelOptions: {
      presets: [
        // 继承了react-app之后，页面会有一些报错，使用下面的配置，来解决页面报错问题
        ["babel-preset-react-app", false],
        "babel-preset-react-app/prod",
      ],
    },
  },
};
