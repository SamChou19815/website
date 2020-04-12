// eslint-disable-next-line @typescript-eslint/no-require-imports
module.exports = require('../../configuration/cra-config-overrider')((config) => {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  });
  // eslint-disable-next-line no-param-reassign
  config.output.globalObject = 'this';
  return config;
});
