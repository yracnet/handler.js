import fs from 'fs';
import pkg from './package.json';
var comment = function(name) {
    return "/*!\n" + String(fs.readFileSync(name))
        .trim()
        .split('\n')
        .map(l => ` * ${l}`)
        .join('\n') +
        "\n */";
};
module.exports = {
    input: 'src/main.js',
    output: {
        file: 'target/handler.js',
        name: pkg.name,
        format: 'umd',
        banner: comment('./LICENSE')
    }
};