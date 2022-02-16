var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('graceful-fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var Q = require('q');
var mout = require('mout');
var Logger = require('bower-logger');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');
var defaultConfig = require('../../../lib/config');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp');
var originalrefs = GitResolver.refs;
var logger;

before(function () {
logger = new Logger();
});

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

describe('misc', function () {
it.skip('should error out if git is not installed');
it.skip('should setup git template dir to an empty folder');
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
});

describe('._resolve', function () {
afterEach(clearResolverRuntimeCache);

it('should call the necessary functions by the correct order', function (next) {
var resolver;

function DummyResolver() {
GitResolver.apply(this, arguments);
this._stack = [];
}

util.inherits(DummyResolver, GitResolver);
mout.object.mixIn(DummyResolver, GitResolver);

DummyResolver.prototype.getStack = function () {
return this._stack;
};

DummyResolver.refs = function () {
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
};

DummyResolver.prototype._cleanup = function () {
this._stack.push('before _cleanup');
return GitResolver.prototype._cleanup.apply(this, arguments)
.then(function (val) {
this._stack.push('after _cleanup');
return val;
}.bind(this));
};

resolver = new DummyResolver({ source: 'foo', target: 'master' }, defaultConfig, logger);

resolver.resolve()
.then(function () {
expect(resolver.getStack()).to.eql([
'before _findResolution',
'after _findResolution',
'before _checkout',
'after _checkout',
'before _cleanup',
'after _cleanup'
]);
next();
})
.done();
});

it('should reject the promise if _checkout is not implemented', function (next) {
var resolver = create('foo');

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('_checkout not implemented');
next();
})
.done();
});

it('should reject the promise if #refs is not implemented', function (next) {
var resolver = create('foo');

resolver._checkout = function () {
return Q.resolve();
};

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('refs not implemented');
next();
})
.done();
});
});

describe('._findResolution', function () {
afterEach(clearResolverRuntimeCache);

it('should resolve to an object', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.be.an('object');
next();
})
.done();
});

it('should fail to resolve * if no tags/heads are found', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([]);
};

resolver = create('foo');
resolver._findResolution('*')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/branch master does not exist/i);
expect(err.details).to.match(/no branches found/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});

it('should resolve "*" to the latest commit on master if a repository has no valid semver tags', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/some-branch',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/some-tag'
]);
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'branch',
branch: 'master',
commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
});
next();
})
.done();
});

it('should resolve "*" to the latest version if a repository has valid semver tags, ignoring pre-releases', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/v0.1.1',
'dddddddddddddddddddddddddddddddddddddddd refs/tags/0.2.0-rc.1'
]);
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'version',
tag: 'v0.1.1',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
});
next();
})
.done();
});

it('should resolve "*" to the latest version if a repository has valid semver tags, not ignoring pre-releases if they are the only versions', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0-rc.1',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/0.1.0-rc.2'
]);
};

resolver = create('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'version',
tag: '0.1.0-rc.2',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
});
next();
})
.done();
});

it('should resolve to the latest version that matches a range/version', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/v0.1.1',
'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee refs/tags/0.2.0',
'ffffffffffffffffffffffffffffffffffffffff refs/tags/v0.2.1'
]);
};

resolver = create('foo');
resolver._findResolution('~0.2.0')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'version',
tag: 'v0.2.1',
commit: 'ffffffffffffffffffffffffffffffffffffffff'
});
next();
})
.done();
});

it('should resolve to a branch even if target is a range/version that does not exist', function (next) {
var resolver;


GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/3.0.0-wip',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/v0.1.1'
]);
};

resolver = create('foo');
resolver._findResolution('3.0.0-wip')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'branch',
branch: '3.0.0-wip',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
});
next();
})
.done();
});

it('should resolve to a tag even if target is a range that does not exist', function (next) {
var resolver;

GitResolver.refs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/1.0'
]);
};

resolver = create('foo');
resolver._findResolution('1.0')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'tag',
