var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');
var Logger = require('../../../lib/core/Logger');
var defaultConfig = require('../../../lib/config');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var originalrefs = GitResolver.refs;
var logger = new Logger();

afterEach(function () {
logger.removeAllListeners();
});

function clearResolverRuntimeCache() {
GitResolver.refs = originalrefs;
GitResolver.clearRuntimeCache();
}

function create(decEndpoint, config) {
if (typeof decEndpoint === 'string') {
decEndpoint = { source: decEndpoint };
}

return new GitResolver(decEndpoint, config || defaultConfig, logger);
}

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

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_resolution: {
type: 'version',
tag: '0.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a higher version for a range is available', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.0',
_resolution: {
type: 'version',
tag: '1.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.1'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a resolved to a lower version of a range', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'version',
tag: '1.0.1',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be false when resolved to the same tag (with same commit hash) for a given range', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'version',
tag: '1.0.1',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/1.0.1'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should be true when resolved to the same tag (with different commit hash) for a given range', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'version',
tag: '1.0.1',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'dddddddddddddddddddddddddddddddddddddddd refs/tags/1.0.1'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a different commit hash for a given branch is available', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
_resolution: {
type: 'branch',
branch: 'master',
commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be false when resolved to the the same commit hash for a given branch', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
_resolution: {
type: 'branch',
branch: 'master',
commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
}
}));
GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = create('foo');
resolver.hasNew(tempDir)
.then(function (hasNew) {
expect(hasNew).to.be(false);
next();
})
.done();
});

it('should be false when targeting commit hashes', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, '.bower.json'), JSON.stringify({
name: 'foo',
_resolution: {
type: 'commit',
commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
}
}));
GitResolver.refs = function () {
