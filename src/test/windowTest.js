const expect = require("chai").expect;
const moduleLoad = require('./moduleLoad');

var execute = moduleLoad('windowHandler', 'src/main/window.js');


describe("Test windowHandler", function() {
    it("Compile Window", function() {
        return execute.then(windowHandler => {
            expect(windowHandler).not.be.undefined;
        });
    });
    it("Window Basic", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            expect(window.name()).to.equal("a");
            expect(window.a).to.equal(true);
        });
    });
    it("Window Basic open: a, b, c", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            window.open({ name: 'c', title: 'windows C' });
            expect(window.name()).to.equal("c");
            expect(window.c).to.equal(true);
        });
    });
    it("Window Basic open: a, b, c, a", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            window.open({ name: 'c', title: 'windows C' });
            window.open({ name: 'a', title: 'windows A 2' });
            window.open({ name: 'b', title: 'windows B 2' });
            expect(window.length()).to.equal(3);
            expect(window.name()).to.equal("b");
            expect(window.b).to.equal(true);
        });
    });
    it("Window Basic open: a, b, c, d close: a", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            window.open({ name: 'c', title: 'windows C' });
            window.open({ name: 'd', title: 'windows D' });
            expect(window.length()).to.equal(4);
            expect(window.name()).to.equal("d");
            expect(window.d).to.equal(true);
            window.close('a');
            expect(window.length()).to.equal(3);
            expect(window.name()).to.equal("d");
            expect(window.d).to.equal(true);
        });
    });
    it("Window Basic open: a, b, c, d close: NULL", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            window.open({ name: 'c', title: 'windows C' });
            window.open({ name: 'd', title: 'windows D' });
            expect(window.length()).to.equal(4);
            expect(window.name()).to.equal("d");
            window.close();
            expect(window.length()).to.equal(3);
            expect(window.name()).to.equal("c");
            expect(window.c).to.equal(true);
        });
    });
    it("Window Basic open: a, b close: x", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            expect(window.length()).to.equal(2);
            expect(window.name()).to.equal("b");
            expect(window.b).to.equal(true);
            window.close({ name: 'x' });
            expect(window.length()).to.equal(2);
            expect(window.name()).to.equal("b");
            expect(window.b).to.equal(true);
        });
    });
    it("Window Basic open: a, b close: null, null, null", function() {
        return execute.then(windowHandler => {
            let window = windowHandler();
            window.open({ name: 'a', title: 'windows A' });
            window.open({ name: 'b', title: 'windows B' });
            expect(window.length()).to.equal(2);
            expect(window.name()).to.equal("b");
            expect(window.b).to.equal(true);
            window.close();
            window.close();
            window.close();
            expect(window.length()).to.equal(0);
            expect(window.name()).be.undefined;
        });
    });
});