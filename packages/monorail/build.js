const { writeFileSync } = require('fs');
const { join } = require('path');

require('@vercel/ncc')(join(__dirname, 'src', 'index.ts'), {
  filename: 'monorail',
  minify: true,
  sourceMapRegister: false,
  transpileOnly: true,
  quiet: true,
}).then(({ code }) => writeFileSync(join(__dirname, 'bin', 'monorail'), code));
