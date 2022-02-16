var expect = require('expect.js');
var util = require('util');
var path = require('path');
var fs = require('fs');
var chmodr = require('chmodr');
var rimraf = require('rimraf');
var Q = require('q');
var mout = require('mout');
var copy = require('../../../lib/util/copy');
var GitResolver = require('../../../lib/core/resolvers/GitResolver');

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

resolver = new DummyResolver('foo', { target: 'master' });

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
afterEach(clearResolverRuntimeCache);

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

it('should resolve "*" to the latest commit on master if a repository has no valid semver tags', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/heads/some-branch',
'cccccccccccccccccccccccccccccccccccccccc refs/tags/some-tag'
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
expect(resolution).to.eql({
type: 'version',
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
expect(resolution).to.eql({
type: 'version',
tag: 'v0.2.1',
commit: 'ffffffffffffffffffffffffffffffffffffffff'
});
next();
})
.done();
});

it('should fail to resolve if none of the versions matched a range/version', function (next) {
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
expect(err.details).to.match(/available versions: 0\.1\.1, 0\.1\.0/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});

it('should fail to resolve if there are no versions to match a range/version', function (next) {
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
expect(resolution).to.eql({
type: 'commit',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
});
next();
})
.done();
});

it('should resolve to the specified tag if it exists', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/some-tag'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('some-tag')
.then(function (resolution) {
expect(resolution).to.eql({
type: 'tag',
tag: 'some-tag',
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
expect(resolution).to.eql({
type: 'branch',
branch: 'some-branch',
commit: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
});
next();
})
.done();
});

it('should fail to resolve to the specified tag/branch if it doesn\'t exists', function (next) {
var resolver;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master',
'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb refs/tags/some-tag'
]);
};

resolver = new GitResolver('foo');
resolver._findResolution('some-branch')
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.message).to.match(/tag\/branch "some-branch" does not exist/i);
expect(err.details).to.match(/available branches: master/i);
expect(err.details).to.match(/available tags: some-tag/i);
expect(err.code).to.equal('ENORESTARGET');
next();
})
.done();
});
});

describe('._cleanup', function () {
beforeEach(function () {
fs.mkdirSync(tempDir);
});

afterEach(function (next) {
clearResolverRuntimeCache();


chmodr(tempDir, 0777, function () {
rimraf(tempDir, next);
});
});

it('should remove the .git folder from the temp dir', function (next) {
var resolver = new GitResolver('foo');
var dest = path.join(tempDir, '.git');


copy.copyDir(path.resolve(__dirname, '../../../.git'), dest, {
mode: 0777
})
.then(function () {
resolver._tempDir = tempDir;

return resolver._cleanup()
.then(function () {
expect(fs.existsSync(dest)).to.be(false);
next();
});
})
.done();
});

it('should not fail if .git does not exist for some reason', function (next) {
var resolver = new GitResolver('foo');
var dest = path.join(tempDir, '.git');

resolver._tempDir = tempDir;

resolver._cleanup()
.then(function () {
expect(fs.existsSync(dest)).to.be(false);
next();
})
.done();
});

it('should sill run even if _checkout fails for some reason', function (next) {
var resolver = new GitResolver('foo');
var called = false;

GitResolver.fetchRefs = function () {
return Q.resolve([
'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa refs/heads/master'
]);
};

resolver._tempDir = tempDir;
resolver._checkout = function () {
return Q.reject(new Error('Some error'));
};

resolver._cleanup = function () {
called = true;
return GitResolver.prototype._cleanup.apply(this, arguments);
};

resolver.resolve()
.then(function () {
next(new Error('Should have failed'));
}, function () {
expect(called).to.be(true);
next();
})
.done();
});
});

describe('._savePkgMeta', function () {
before(function () {
fs.mkdirSync(tempDir);
});

afterEach(function (next) {
rimraf(path.join(tempDir, '.bower.json'), next);
});

after(function (next) {
rimraf(tempDir, next);
});

it('should save the resolution to the .bower.json to be used later by .hasNew', function (next) {
var resolver = new GitResolver('foo');

resolver._resolution = { type: 'version', tag: '0.0.1' };
resolver._tempDir = tempDir;

resolver._savePkgMeta({ name: 'foo', version: '0.0.1' })
.then(function () {
return Q.nfcall(fs.readFile, path.join(tempDir, '.bower.json'));
})
.then(function (contents) {
var json = JSON.parse(contents.toString());

expect(json._resolution).to.eql(resolver._resolution);
next();
})
.done();
});

it('should add the version to the package meta if not present and resolution is a version', function (next) {
var resolver = new GitResolver('foo');

resolver._resolution = { type: 'version', tag: 'v0.0.1' };
resolver._tempDir = tempDir;

resolver._savePkgMeta({ name: 'foo' })
.then(function () {
return Q.nfcall(fs.readFile, path.join(tempDir, '.bower.json'));
})
.then(function (contents) {
var json = JSON.parse(contents.toString());
expect(json.version).to.equal('0.0.1');

next();
})
.done();
});

it('should remove the version from the package meta if resolution is not a version', function (next) {
var resolver = new GitResolver('foo');

resolver._resolution = { type: 'commit', commit: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' };
resolver._tempDir = tempDir;

resolver._savePkgMeta({ name: 'foo', version: '0.0.1' })
.then(function () {
return Q.nfcall(fs.readFile, path.join(tempDir, '.bower.json'));
})
.then(function (contents) {
var json = JSON.parse(contents.toString());
expect(json).to.not.have.property('version');

next();
})
.done();
});

it('should warn if the resolution version is different than the package meta version', function (next) {
var resolver = new GitResolver('foo');
var notified = false;

resolver._resolution = { type: 'version', tag: '0.0.1' };
resolver._tempDir = tempDir;

resolver._savePkgMeta({ name: 'foo', version: '0.0.0' })
.then(function () {
return Q.nfcall(fs.readFile, path.join(tempDir, '.bower.json'));
}, null, function (notification) {
expect(notification).to.be.an('object');

if (notification.type === 'warn' && /\(0\.0\.0\).*different.*\(0\.0\.1\)/.test(notification.data)) {
notified = true;
}
})
.then(function (contents) {
var json = JSON.parse(contents.toString());
expect(json.version).to.equal('0.0.1');
expect(notified).to.be(true);

next();
})
.done();
});

it('should not warn if the resolution version and the package meta version are the same', function (next) {
var resolver = new GitResolver('foo');
var notified = false;

resolver._resolution = { type: 'version', tag: 'v0.0.1' };
resolver._tempDir = tempDir;

resolver._savePkgMeta({ name: 'foo', version: '0.0.1' })
.then(function () {
return Q.nfcall(fs.readFile, path.join(tempDir, '.bower.json'));
}, null)
.then(function (contents) {
var json = JSON.parse(contents.toString());
expect(json.version).to.equal('0.0.1');
expect(notified).to.be(false);

next();
})
.done();
});
