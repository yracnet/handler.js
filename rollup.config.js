import fs from 'fs';
import pkg from './package.json';
module.exports = {
  input: 'src/main.js',
  output: {
    file: 'target/handler.js',
    name: pkg.name,
    format: 'umd',
    banner: (
      `/*!\n${
      String(fs.readFileSync('./LICENSE'))
        .trim()
        .split('\n')
        .map(l => ` * ${l}`)
        .join('\n')
      }\n */`
    )
  }
};