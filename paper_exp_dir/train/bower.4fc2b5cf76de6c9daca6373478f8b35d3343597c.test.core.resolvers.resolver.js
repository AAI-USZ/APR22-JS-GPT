var expect = require('expect.js');
var fs = require('graceful-fs');
var path = require('path');
var util = require('util');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var tmp = require('tmp');
var Q = require('q');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var copy = require('../../../lib/util/copy');
var Resolver = require('../../../lib/core/resolvers/Resolver');
var defaultConfig = require('../../../lib/config');

describe('Resolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var logger;
var dirMode0777;
var config = defaultConfig();

before(function () {
var stat;

mkdirp.sync(tempDir);
stat = fs.statSync(tempDir);
dirMode0777 = stat.mode;
rimraf.sync(tempDir);

logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new Resolver(decEndpoint, config, logger);
}

describe('.getSource', function () {
it('should return the resolver source', function () {
var resolver = create('foo');

expect(resolver.getSource()).to.equal('foo');
});
});

describe('.getName', function () {
it('should return the resolver name', function () {
var resolver = create({ source: 'foo', name: 'bar' });

expect(resolver.getName()).to.equal('bar');
});

it('should return the resolver source if none is specified (default guess mechanism)', function () {
var resolver = create('foo');

expect(resolver.getName()).to.equal('foo');
});
});

describe('.getTarget', function () {
it('should return the resolver target', function () {
var resolver = create({ source: 'foo', target: '~2.1.0' });

expect(resolver.getTarget()).to.equal('~2.1.0');
});

it('should return * if none was configured', function () {
var resolver = create('foo');

expect(resolver.getTarget()).to.equal('*');
});

it('should return * if latest was configured (for backwards compatibility)', function () {
var resolver = create('foo');

expect(resolver.getTarget()).to.equal('*');
});
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

beforeEach(function () {
fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'test'
}));
});

after(function (next) {
rimraf(tempDir, next);
});

it('should throw an error if already working (resolving)', function (next) {
var resolver = create('foo');
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

resolver.hasNew({})
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should throw an error if already working (checking for newer version)', function (next) {
var resolver = create('foo');
var succeeded;

resolver.hasNew({})
.then(function () {

resolver.hasNew({})
.then(function () {
next(succeeded ? new Error('Should have failed') : null);
});
})
.done();

resolver.hasNew({})
.then(function () {
succeeded = true;
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EWORKING');
expect(err.message).to.match(/already working/i);
});
});

it('should resolve to true by default', function (next) {
var resolver = create('foo');

resolver.hasNew({})
.then(function (hasNew) {
expect(hasNew).to.equal(true);
next();
})
.done();
});

it('should call _hasNew with the package meta', function (next) {
var resolver = create('foo');
var meta;

resolver._hasNew = function (pkgMeta) {
meta = pkgMeta;
