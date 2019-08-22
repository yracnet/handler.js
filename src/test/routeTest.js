const expect = require("chai").expect;
const moduleLoad = require('./moduleLoad');

var execute = moduleLoad('routeHandler', 'src/main/route.js');

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

describe("Test routeHandler", function() {
    it("Compile Route", function() {
        return execute.then(routeHandler => {
            expect(routeHandler).not.be.undefined;
        });
    });
    it("Route Basic", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            expect(route.name()).to.equal("a");
            expect(route.a).to.equal(true);
        });
    });
    it("Route Basic a->b->c", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            route.next();
            route.next();
            expect(route.name()).to.equal("c");
            expect(route.c).to.equal(true);
        });
    });
    it("Route Basic a->b->c->null", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            route.next();
            route.next();
            route.next();
            expect(route.name()).to.be.null;
        });
    });
    it("Route Basic a->b->c-> -> -> null", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            route.next();
            route.next();
            route.next();
            route.next();
            route.next();
            route.next();
            expect(route.name()).to.be.null;
        });
    });
    it("Route Basic a->b->c-> <- <-", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            route.next();
            route.next();
            route.next();
            route.back();
            route.back();
            expect(route.name()).to.equal("b");
            expect(route.b).to.equal(true);
        });
    });
    it("Route Basic a <- <- <- <-", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphBasic, 'a');
            route.back();
            route.back();
            route.back();
            route.back();
            expect(route.name()).to.equal("a");
            expect(route.a).to.equal(true);
        });
    });


    it("Route Other", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphOther, 'a');
            expect(route.name()).to.equal("a");
            expect(route.a).to.equal(true);
        });
    });
    it("Route Other a->b1", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphOther, 'a');
            valor = 'b1';
            route.next();
            expect(route.name()).to.equal("b1");
            expect(route.b1).to.equal(true);
        });
    });
    it("Route Other a->b2", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphOther, 'a');
            valor = 'b2';
            route.next();
            expect(route.name()).to.equal("b2");
            expect(route.b2).to.equal(true);
        });
    });
    it("Route Other a->b2->c", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphOther, 'a');
            valor = 'b2';
            route.next();
            route.next();
            expect(route.name()).to.equal("c");
            expect(route.c).to.equal(true);
        });
    });
    it("Route Other a->b2->c<-", function() {
        return execute.then(routeHandler => {
            let route = routeHandler(graphOther, 'a');
            valor = 'b2';
            route.next();
            route.next();
            route.back();
            expect(route.name()).to.equal("b2");
            expect(route.b2).to.equal(true);
        });
    });

});