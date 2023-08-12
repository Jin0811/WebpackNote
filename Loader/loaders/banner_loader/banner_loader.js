const schema = require("./schema.json");

module.exports = function (content) {
  // 获取配置项 const options = this.getOptions(schema);
  // this.getOptions会使用schema对参数进行校验，校验通过才会返回数据，校验不通过会报错
  // 参数schema要符合JSON Schema的规则，下面是一个示例：
  // {
  //   "type": "object",
  //   "properties": {
  //     "author": {
  //       "type": "string"
  //     }
  //   },
  //   // 是否允许添加新的属性，如果设置为false，那只能传递string形式的author字段，类型错误或者是参数不一致，都会报错
  //   "additionalProperties": false,
  // }

  const options = this.getOptions(schema);
  const prefix = `
    /**
     * @author ${options.author}
     */
  `;
  return prefix + content;
};
