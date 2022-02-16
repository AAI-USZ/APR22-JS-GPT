var expect = require('expect.js');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var tmp = require('tmp');
var cmd = require('../../lib/util/cmd');
var Resolver = require('../../lib/resolve/Resolver');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../assets/tmp');

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
it('should reject the promise if _resolveSelf is not implemented', function (next) {
var resolver = new Resolver('foo');

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('_resolveSelf not implemented');
next();
})
.done();
});

