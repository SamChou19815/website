module.exports = (pre) => {
  pre().then(() => require('.'));
};
