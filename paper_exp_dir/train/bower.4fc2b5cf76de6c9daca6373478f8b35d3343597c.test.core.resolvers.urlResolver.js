var expect = require('expect.js');
var path = require('path');
var fs = require('graceful-fs');
var nock = require('nock');
var Q = require('q');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Logger = require('bower-logger');
var cmd = require('../../../lib/util/cmd');
var UrlResolver = require('../../../lib/core/resolvers/UrlResolver');
var defaultConfig = require('../../../lib/config');

describe('UrlResolver', function () {
var testPackage = path.resolve(__dirname, '../../assets/package-a');
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var logger;

before(function (next) {
logger = new Logger();


cmd('git', ['checkout', '0.2.1'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

afterEach(function () {
logger.removeAllListeners();


nock.cleanAll();
});

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new UrlResolver(decEndpoint, defaultConfig(), logger);
}

describe('.constructor', function () {
it('should guess the name from the URL', function () {
var resolver = create('http://bower.io/foo.txt');

expect(resolver.getName()).to.equal('foo');
});

it('should remove ?part from the URL when guessing the name', function () {
var resolver = create('http://bower.io/foo.txt?bar');

expect(resolver.getName()).to.equal('foo');
});

it('should not guess the name or remove ?part from the URL if not guessing', function () {
var resolver = create({ source: 'http://bower.io/foo.txt?bar', name: 'baz' });

expect(resolver.getName()).to.equal('baz');
});

it('should error out if a target was specified', function (next) {
var resolver;

try {
resolver = create({ source: testPackage, target: '0.0.1' });
} catch (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/can\'t resolve targets/i);
expect(err.code).to.equal('ENORESTARGET');
return next();
}

next(new Error('Should have thrown'));
});
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

afterEach(function (next) {
rimraf(path.join(tempDir, '.bower.json'), next);
});

after(function (next) {
rimraf(tempDir, next);
});

it('should resolve to true if the response is not in the 2xx range', function (next) {
var resolver = create('http:

nock('http://bower.io')
.head('/foo.js')
.reply(500);

var pkgMeta = {
name: 'foo',
version: '0.0.0'
};

resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should resolve to true if cache headers changed', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.reply(200, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

var pkgMeta = {
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': 'fk3454fdmmlw20i9nf',
'Last-Modified': 'Tue, 16 Nov 2012 13:35:29 GMT'
}
};

resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should resolve to false if cache headers haven\'t changed', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.reply(200, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

var pkgMeta = {
name: 'foo',
version: '0.0.0',
_cacheHeaders: {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
}
};

resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should resolve to true if server responds with 304 (ETag mechanism)', function (next) {
var resolver = create('http://bower.io/foo.js');

nock('http://bower.io')
.head('/foo.js')
.matchHeader('If-None-Match', '686897696a7c876b7e')
.reply(304, '', {
'ETag': '686897696a7c876b7e',
'Last-Modified': 'Tue, 15 Nov 2012 12:45:26 GMT'
});

var pkgMeta = {
