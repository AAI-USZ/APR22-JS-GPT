var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var util = require('util');
var rimraf = require('rimraf');
var tmp = require('tmp');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');
var Resolver = require('../../lib/resolve/Resolver');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../assets/tmp');
var testPackage = path.resolve(__dirname, '../assets/github-test-package');

describe('.getSource', function () {
it('should return the resolver source', function () {
var resolver = new Resolver('foo');

expect(resolver.getSource()).to.equal('foo');
});
});

describe('.getName', function () {
it('should return the resolver name', function () {
var resolver = new Resolver('foo', { name: 'bar' });

expect(resolver.getName()).to.equal('bar');
});

it('should return the resolver source if none is specified (default guess mechanism)', function () {
var resolver = new Resolver('foo');

expect(resolver.getName()).to.equal('foo');
});
});

describe('.getTarget', function () {
it('should return the resolver target', function () {
var resolver = new Resolver('foo', { target: '~2.1.0' });

expect(resolver.getTarget()).to.equal('~2.1.0');
});

it('should return * if none was configured', function () {
var resolver = new Resolver('foo');

expect(resolver.getTarget()).to.equal('*');
});
});

describe('.hasNew', function () {
it('should throw an error if already working (resolving)', function (next) {
var resolver = new Resolver('foo');
var succeeded;

resolver._resolve = function () {};

resolver.resolve()
.then(function () {

resolver.resolve()
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.hasNew()
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should throw an error if already working (checking for newer version)', function (next) {
var resolver = new Resolver('foo');
var succeeded;

resolver.hasNew()
.then(function () {

resolver.hasNew()
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.hasNew()
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should resolve to true by default', function (next) {
var resolver = new Resolver('foo');

resolver.hasNew('.')
.then(function (hasNew) {
expect(hasNew).to.equal(true);
next();
})
.done();
});
});

describe('.resolve', function () {
it('should reject the promise if _resolve is not implemented', function (next) {
var resolver = new Resolver('foo');

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('_resolve not implemented');
next();
})
.done();
});

it('should throw an error if already working (resolving)', function (next) {
var resolver = new Resolver('foo');
var succeeded;
