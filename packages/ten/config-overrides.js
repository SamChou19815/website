module.exports = config => {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' }
  });
  // eslint-disable-next-line no-param-reassign
  config.output.globalObject = 'this';
  return config;
};
