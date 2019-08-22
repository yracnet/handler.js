const expect = require("chai").expect;
const moduleLoad = require('./moduleLoad');

var execute = moduleLoad('windowHandler', 'src/main/window.js');
/*
var graphBasic = [
    { name: 'a', next: 'b' },
    { name: 'b', next: 'c' },
    { name: 'c', next: null }
];
var valor = 'b1';
var graphOther = [{
        name: 'a',
        next: function() { return valor; }
    },
    { name: 'b1', next: 'c' },
    { name: 'b2', next: 'c' },
    { name: 'c', next: null }
];

describe("Test windowHandler", function() {
    it("Compile Route", function() {
        return execute.then(windowHandler => {
            expect(windowHandler).not.be.undefined;
        });
    });
    it("Route Basic", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            expect(window.name()).to.equal("a");
            expect(window.a).to.equal(true);
        });
    });
    it("Route Basic a->b->c", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            window.next();
            window.next();
            expect(window.name()).to.equal("c");
            expect(window.c).to.equal(true);
        });
    });
    it("Route Basic a->b->c->null", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            window.next();
            window.next();
            window.next();
            expect(window.name()).to.be.null;
        });
    });
    it("Route Basic a->b->c-> -> -> null", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            window.next();
            window.next();
            window.next();
            window.next();
            window.next();
            window.next();
            expect(window.name()).to.be.null;
        });
    });
    it("Route Basic a->b->c-> <- <-", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            window.next();
            window.next();
            window.next();
            window.back();
            window.back();
            expect(window.name()).to.equal("b");
            expect(window.b).to.equal(true);
        });
    });
    it("Route Basic a <- <- <- <-", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphBasic, 'a');
            window.back();
            window.back();
            window.back();
            window.back();
            expect(window.name()).to.equal("a");
            expect(window.a).to.equal(true);
        });
    });


    it("Route Other", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphOther, 'a');
            expect(window.name()).to.equal("a");
            expect(window.a).to.equal(true);
        });
    });
    it("Route Other a->b1", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphOther, 'a');
            valor = 'b1';
            window.next();
            expect(window.name()).to.equal("b1");
            expect(window.b1).to.equal(true);
        });
    });
    it("Route Other a->b2", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphOther, 'a');
            valor = 'b2';
            window.next();
            expect(window.name()).to.equal("b2");
            expect(window.b2).to.equal(true);
        });
    });
    it("Route Other a->b2->c", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphOther, 'a');
            valor = 'b2';
            window.next();
            window.next();
            expect(window.name()).to.equal("c");
            expect(window.c).to.equal(true);
        });
    });
    it("Route Other a->b2->c<-", function() {
        return execute.then(windowHandler => {
            let window = windowHandler(graphOther, 'a');
            valor = 'b2';
            window.next();
            window.next();
            window.back();
            expect(window.name()).to.equal("b2");
            expect(window.b2).to.equal(true);
        });
    });
});
/**/