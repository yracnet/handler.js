var expect = require("chai").expect;
const rollup = require('rollup');
var parseUMD = function (name, file) {
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
}
var execute = parseUMD('panelHandler', 'src/main/panel.js');
describe("Test panelHandler", function () {
    it("Compile Panel", function () {
        return execute.then(panelHandler => {
            expect(panelHandler).not.be.undefined;
        });
    });
    it("Panel Default", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler();
            expect(panel.name()).to.equal("index");
            expect(panel.index).to.equal(true);
        });
    });
    it("Panel other", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler('other');
            expect(panel.name()).to.equal("other");
            expect(panel.other).to.equal(true);
        });
    });
    it("Panel open A", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler('other');
            panel.open('A');
            expect(panel.name()).to.equal("A");
            expect(panel.A).to.equal(true);
        });
    });
    it("Panel open A->B->C", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler('other');
            panel.open('A');
            panel.open('B');
            panel.open('C');
            expect(panel.name()).to.equal("C");
            expect(panel.C).to.equal(true);
        });
    });
    it("Panel open A->B->C <- <-", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler('other');
            panel.open('A');
            panel.open('B');
            panel.open('C');
            panel.back();
            panel.back();
            expect(panel.name()).to.equal("A");
            expect(panel.A).to.equal(true);
        });
    });
    it("Panel open A <- <- <-", function () {
        return execute.then(panelHandler => {
            let panel = panelHandler('A');
            panel.back();
            panel.back();
            panel.back();
            panel.back();
            expect(panel.name()).to.equal("A");
            expect(panel.A).to.equal(true);
        });
    });
});