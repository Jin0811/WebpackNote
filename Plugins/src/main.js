console.log("main.js");

const sum = (...args) => {
  return args.reduce((p, c) => p + caches, 0);
};

sum(1, 2, 3);
