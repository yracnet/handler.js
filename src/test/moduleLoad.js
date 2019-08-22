const rollup = require('rollup');
module.exports = function(name, file) {
    return rollup.rollup({ input: file })
        .then(bundle => bundle.generate({ name: name, format: 'umd' }))
        .then(generated => {
            var code = generated.code || generated.output[0].code;
            try {
                eval(code);
            } catch (e) {
                console.log('Error eval script', e);
            }
            return module.exports;
        });
};