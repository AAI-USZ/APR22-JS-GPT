var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var Q = require('q');
var mout = require('mout');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/resolve/resolvers/GitResolver');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var originalFetchRefs = GitResolver.fetchRefs;

function clearResolverRuntimeCache() {
GitResolver.fetchRefs = originalFetchRefs;
GitResolver.clearRuntimeCache();
}

describe('.hasNew', function () {
before(function () {
fs.mkdirSync(tempDir);
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.1'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/1.0.1'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0.0',
'dddddddddddddddddddddddddddddddddddddddd refs/tags/1.0.1'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');
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
GitResolver.fetchRefs = function () {
return Q.resolve([
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/master'
]);
};

resolver = new GitResolver('foo');
resolver.hasNew(tempDir)
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
function DummyResolver() {
GitResolver.apply(this, arguments);
this._stack = [];
}

util.inherits(DummyResolver, GitResolver);
mout.object.mixIn(DummyResolver, GitResolver);

DummyResolver.prototype.getStack = function () {
return this._stack;
};

DummyResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

DummyResolver.prototype.resolve = function () {
this._stack = [];
return GitResolver.prototype.resolve.apply(this, arguments);
};

DummyResolver.prototype._findResolution = function () {
this._stack.push('before _findResolution');
return GitResolver.prototype._findResolution.apply(this, arguments)
.then(function (val) {
this._stack.push('after _findResolution');
return val;
}.bind(this));
};

DummyResolver.prototype._checkout = function () {
this._stack.push('before _checkout');
return Q.resolve()
.then(function (val) {
this._stack.push('after _checkout');
return val;
}.bind(this));
