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
return Q.resolve({
'1.0.0': 2
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

it('should be false when resolved to the same tag (with same commit hash) for a given range', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'version',
tag: '1.0.1',
commit: 2
}
};

SvnResolver.tags = function () {
return Q.resolve({
'1.0.0': 1,
'1.0.1': 2
});
};

resolver = create('foo');
resolver.hasNew(pkgMeta)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should be true when resolved to the same tag (with different commit hash) for a given range', function (next) {
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
return Q.resolve({
'1.0.0': 2,
'1.0.1': 4
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


it('should be false when targeting commit hashes', function (next) {
var resolver;

var pkgMeta = {
name: 'foo',
_resolution: {
type: 'commit',
commit: 1
}
};

SvnResolver.tags = function () {
return Q.resolve({
'1.0.0': 2
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
});

describe('._resolve', function () {
afterEach(clearResolverRuntimeCache);

it('should call the necessary functions by the correct order', function (next) {
var resolver;

function DummyResolver() {
SvnResolver.apply(this, arguments);
this._stack = [];
}

util.inherits(DummyResolver, SvnResolver);
mout.object.mixIn(DummyResolver, SvnResolver);

DummyResolver.prototype.getStack = function () {
return this._stack;
};

DummyResolver.tags  = function () {
return Q.resolve({
'1.0.0': 1
});
};

DummyResolver.prototype.resolve = function () {
this._stack = [];
return SvnResolver.prototype.resolve.apply(this, arguments);
};

DummyResolver.prototype._findResolution = function () {
this._stack.push('before _findResolution');
return SvnResolver.prototype._findResolution.apply(this, arguments)
.then(function (val) {
this._stack.push('after _findResolution');
return val;
}.bind(this));
};

DummyResolver.prototype._export = function () {
this._stack.push('before _export');
return Q.resolve()
.then(function (val) {
this._stack.push('after _export');
return val;
}.bind(this));
};

resolver = new DummyResolver({ source: 'foo', target: '1.0.0' }, defaultConfig(), logger);

resolver.resolve()
.then(function () {
expect(resolver.getStack()).to.eql([
'before _findResolution',
'after _findResolution',
'before _export',
'after _export'
]);
next();
})
.done();
});

});

describe('._findResolution', function () {
afterEach(clearResolverRuntimeCache);

it('should resolve to an object', function (next) {
var resolver;

SvnResolver.tags = function () {
return Q.resolve({});
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.be.an('object');
next();
})
.done();
});

it('should resolve "*" to the trunk if a repository has no valid semver tags', function (next) {
var resolver;

SvnResolver.tags = function () {
return Q.resolve({
'some-tag': 1
});
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'branch',
branch: 'trunk',
commit: '*'
});
next();
})
.done();
});

it('should resolve "*" to the latest version if a repository has valid semver tags, ignoring pre-releases', function (next) {
var resolver;

SvnResolver.tags = function () {
return Q.resolve({
'0.1.0': 1,
'v0.1.1': 2,
'0.2.0-rc.1': 3
});
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'version',
tag: 'v0.1.1',
commit: 2
});
next();
})
.done();
});

it('should resolve "*" to the latest version if a repository has valid semver tags, not ignoring pre-releases if they are the only versions', function (next) {
var resolver;

SvnResolver.tags = function () {
return Q.resolve({
'0.1.0-rc.1': 1,
'0.1.0-rc.2': 2
});
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'version',
tag: '0.1.0-rc.2',
commit: 2
});
next();
})
.done();
