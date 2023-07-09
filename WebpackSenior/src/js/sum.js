export default function sum(...args) {
  // 故意写一个错误，调用两次reduce
  // return args.reduce((pre, cur) => pre + cur, 0)();

  // 正常写法
  return args.reduce((pre, cur) => pre + cur, 0);
}
