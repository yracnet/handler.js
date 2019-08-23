const expect = require("chai").expect;
const moduleLoad = require('./moduleLoad');

var execute = moduleLoad('crumbHandler', 'src/main/crumb.js');

describe("Test crumbHandler", function() {
    let oo = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }];
    it("Compile Crumb", function() {
        return execute.then(crumbHandler => {
            expect(crumbHandler).not.be.undefined;
        });
    });
    it("Crumb Default", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            expect(crumb.name()).be.undefined;
            let o = { name: 'A' };
            crumb.open(o);
            expect(crumb.name()).to.equal(o.name);
        });
    });
    it("Crumb attr=ID", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler('id');
            expect(crumb.name()).be.undefined;
            let o = { id: 'A' };
            crumb.open(o);
            expect(crumb.name()).to.equal(o.id);
            expect(crumb.isOpen(o.id)).to.equal(true);
        });
    });
    it("Crumb open A->B->C->D->E", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            oo.forEach(o => {
                crumb.open(o);
                expect(crumb.name()).to.equal(o.name);
                expect(crumb.isOpen(o.name)).to.equal(true);
            });
            expect(crumb.length()).to.equal(5);
        });
    });
    it("Crumb open A->B->C->C->C", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            [0, 1, 2, 2, 2].forEach(i => {
                crumb.open(oo[i]);
                expect(crumb.name()).to.equal(oo[i].name);
                expect(crumb.isOpen(oo[i].name)).to.equal(true);
            });
            expect(crumb.length()).to.equal(3);
        });
    });
    it("Crumb open A->B->C->D->E go(5)", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            oo.forEach(crumb.open);
            crumb.go(5);
            expect(crumb.name()).to.equal('E');
            expect(crumb.isOpen('E')).to.equal(true);
            expect(crumb.length()).to.equal(5);
            crumb.back();
            expect(crumb.name()).to.equal('D');
            expect(crumb.isOpen('D')).to.equal(true);
            expect(crumb.length()).to.equal(4);
        });
    });
    it("Crumb open A->B->C->D->E go(2)", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            oo.forEach(crumb.open);
            crumb.go(2);
            expect(crumb.name()).to.equal('C');
            expect(crumb.isOpen('C')).to.equal(true);
            expect(crumb.length()).to.equal(3);
        });
    });
    it("Crumb open A->B->C->D->E go(0)", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            oo.forEach(crumb.open);
            crumb.go(0);
            expect(crumb.name()).to.equal('A');
            expect(crumb.isOpen('A')).to.equal(true);
            expect(crumb.length()).to.equal(1);
        });
    });
    it("Crumb open A->B->C->D->E <- <-", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            oo.forEach(crumb.open);
            expect(crumb.name()).to.equal('E');
            crumb.back();
            expect(crumb.name()).to.equal('D');
            crumb.back();
            expect(crumb.name()).to.equal('C');
            expect(crumb.isOpen('C')).to.equal(true);
        });
    });
    it("Crumb open A <- <- <-", function() {
        return execute.then(crumbHandler => {
            let crumb = crumbHandler();
            let o = { name: 'A' };
            crumb.open(o);
            expect(crumb.name()).to.equal('A');
            expect(crumb.isOpen('A')).to.equal(true);
            expect(crumb.length()).to.equal(1);
            crumb.back();
            expect(crumb.length()).to.equal(0);;
            expect(crumb.name()).be.undefined;
            crumb.back();
            crumb.back();
            crumb.back();
            expect(crumb.length()).to.equal(0);
            expect(crumb.name()).be.undefined;
            crumb.open(o);
            expect(crumb.name()).to.equal('A');
            expect(crumb.isOpen('A')).to.equal(true);
            expect(crumb.length()).to.equal(1);
        });
    });
});