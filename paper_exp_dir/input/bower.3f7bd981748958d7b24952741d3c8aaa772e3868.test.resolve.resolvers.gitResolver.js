var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var ncp = require('ncp');
var Q = require('q');
var mout = require('mout');
var GitResolver = require('../../../lib/resolve/resolvers/GitResolver');

describe('GitResolver', function () {
var tempDir = path.resolve(__dirname, '../../assets/tmp'),
originalFetchRefs = GitResolver.fetchRefs;

function cleanInternalResolverCache() {
GitResolver.fetchRefs = originalFetchRefs;
delete GitResolver._versions;
delete GitResolver._heads;
delete GitResolver._refs;
}

describe('.hasNew', function () {
beforeEach(function (next) {
mkdirp(tempDir, next);
});

afterEach(function (next) {
cleanInternalResolverCache();
rimraf(tempDir, next);
});

it('should be true when the resolution type is different', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '0.0.0',
_resolution: {
type: 'tag',
tag: '0.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
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
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a higher version for a range is available', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.0',
_resolution: {
type: 'tag',
tag: '1.0.0',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
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
expect(hasNew).to.be(true);
next();
})
.done();
});

it('should be true when a resolved to a lower version of a range', function (next) {
var resolver;

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'tag',
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

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'tag',
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

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
name: 'foo',
version: '1.0.1',
_resolution: {
type: 'tag',
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

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
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

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
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

fs.writeFileSync(path.join(tempDir, 'bower.json'), JSON.stringify({
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

describe('._resolveSelf', function () {
afterEach(cleanInternalResolverCache);

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
};
DummyResolver.prototype._cleanup = function () {
this._stack.push('before _cleanup');
return GitResolver.prototype._cleanup.apply(this, arguments)
.then(function (val) {
this._stack.push('after _cleanup');
return val;
}.bind(this));
};

var resolver = new DummyResolver('foo', { target: 'master' });

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
var resolver = new GitResolver('foo');

GitResolver.fetchRefs = function () {
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

it('should reject the promise if #fetchRefs is not implemented', function (next) {
var resolver = new GitResolver('foo');

resolver._checkout = function () {
return Q.resolve();
};

resolver.resolve()
.then(function () {
next(new Error('Should have rejected the promise'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.contain('fetchRefs not implemented');
next();
})
.done();
});
});

describe('._findResolution', function () {
afterEach(cleanInternalResolverCache);

it('should resolve to an object', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolution).to.be.an('object');
next();
})
.done();
});

it('should fail to resolve * if no tags/heads are found', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([]);
};

resolver = new GitResolver('foo');
resolver._findResolution('*')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/branch "master" does not exist/i);
expect(err.details).to.match(/no branches found/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});

it('should resolve "*" to the latest commit on master if a repository has no tags', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/some-branch'
]);
};

resolver = new GitResolver('foo');
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

it('should resolve "*" to the latest version if a repository has valid semver tags', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/v0.1.1'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('*')
.then(function (resolution) {
expect(resolver._resolution).to.equal(resolution);
expect(resolution).to.eql({
type: 'tag',
tag: 'v0.1.1',
commit: 'cccccccccccccccccccccccccccccccccccccccc'
});
next();
})
.done();
});

it('should resolve to the latest version that matches a range/version', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/v0.1.1',
'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee refs/tags/0.2.0',
'ffffffffffffffffffffffffffffffffffffffff refs/tags/v0.2.1'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('~0.2.0')
.then(function (resolution) {
expect(resolver._resolution).to.equal(resolution);
expect(resolution).to.eql({
type: 'tag',
tag: 'v0.2.1',
commit: 'ffffffffffffffffffffffffffffffffffffffff'
});
next();
})
.done();
});

it('should fail to resolve if none of the tags matched a range/version', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/0.1.0',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/v0.1.1'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('~0.2.0')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/was able to satisfy "~0.2.0"/i);
expect(err.details).to.match(/available versions in "foo" are: 0\.1\.1, 0\.1\.0/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});

it('should fail to resolve if there are no tags to match a range/version', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');

resolver._findResolution('~0.2.0')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/was able to satisfy "~0.2.0"/i);
expect(err.details).to.match(/no versions found in "foo"/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});

it('should resolve to the specified commit', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
.then(function (resolution) {
expect(resolver._resolution).to.equal(resolution);
expect(resolution).to.eql({
type: 'commit',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
});
next();
})
.done();
});

it('should resolve to the specified branch if it exists', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/some-branch'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('some-branch')
.then(function (resolution) {
expect(resolver._resolution).to.equal(resolution);
expect(resolution).to.eql({
type: 'branch',
branch: 'some-branch',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
});
next();
})
.done();
});

it('should fail to resolve to the specified branch if it doesn\'t exists', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('some-branch')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/branch "some-branch" does not exist/i);
expect(err.details).to.match(/available branches in "foo" are: master/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});
});

describe('._cleanup', function () {
beforeEach(function (next) {
mkdirp(tempDir, next);
});

afterEach(function (next) {

