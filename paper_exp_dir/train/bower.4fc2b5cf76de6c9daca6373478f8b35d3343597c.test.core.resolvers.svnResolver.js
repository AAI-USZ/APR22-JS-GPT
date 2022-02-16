var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var SvnResolver = require('../../../lib/core/resolvers/SvnResolver');
var defaultConfig = require('../../../lib/config');
var helpers = require('../../helpers');

if (!helpers.hasSvn()) describe.skip('SvnResolver', function() {});
else describe('SvnResolver', function () {
var tempDir = path.resolve(__dirname, '../../tmp/tmp');
var testPackage = path.resolve(__dirname, '../../assets/package-svn/repo');

var originaltags = SvnResolver.tags;
var logger;

before(function () {
logger = new Logger();
});

afterEach(function () {
logger.removeAllListeners();
});

function clearResolverRuntimeCache() {
SvnResolver.tags = originaltags;
SvnResolver.clearRuntimeCache();
}

function create(decEndpoint) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new SvnResolver(decEndpoint, defaultConfig(), logger);
}

describe('misc', function () {
it.skip('should error out if svn is not installed');
it.skip('should setup svn template dir to an empty folder');
});

describe('.hasNew', function () {
before(function () {
mkdirp.sync(tempDir);
});

afterEach(function (next) {
clearResolverRuntimeCache();
rimraf(path.join(tempDir, '.bower.json'), next);
});

after(function (next) {
rimraf(tempDir, next);
});


it('should be true when the resolution type is different', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
version: '0.0.0',
_resolution: {
type: 'version',
tag: '0.0.0',
commit: 123
}
};

SvnResolver.tags = function () {
return Q.resolve({
'boo': 123
});
};

SvnResolver.branches = function () {
return Q.resolve({
'trunk': '*'
});
};

resolver = create('foo');
resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a higher version for a range is available', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
version: '1.0.0',
_resolution: {
type: 'version',
tag: '1.0.0',
commit: 3
}
};

SvnResolver.tags = function () {
return Q.resolve({
'1.0.0': 2,
'1.0.1': 2
});
};

resolver = create('foo');
resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a resolved to a lower version of a range', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'version',
tag: '1.0.1',
commit: 3
}
};

SvnResolver.tags = function () {
