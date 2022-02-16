var path = require('path');
var mout = require('mout');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var Q = require('q');
var expect = require('expect.js');
var mkdirp = require('mkdirp');
var ResolveCache = require('../../lib/core/ResolveCache');
var defaultConfig = require('../../lib/config');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');
var md5 = require('../../lib/util/md5');

describe('ResolveCache', function () {
var resolveCache;
var testPackage = path.resolve(__dirname, '../assets/package-a');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var tempPackage2 = path.resolve(__dirname, '../assets/temp2');
var cacheDir = path.join(__dirname, '../assets/temp-resolve-cache');

before(function (next) {

rimraf.sync(cacheDir);


resolveCache = new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
}
}));


cmd('git', ['checkout', '0.2.0'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

beforeEach(function () {

resolveCache.reset();
});

after(function () {

rimraf.sync(cacheDir);
});

describe('.constructor', function () {
beforeEach(function () {

rimraf.sync(tempPackage);
});
after(function () {

rimraf.sync(tempPackage);
});

function initialize(cacheDir) {
return new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
}
}));
}

it('should create the cache folder if it doesn\'t exists', function () {
initialize(tempPackage);
expect(fs.existsSync(tempPackage)).to.be(true);
});

it('should not error out if the cache folder already exists', function () {
mkdirp.sync(tempPackage);
initialize(tempPackage);
});
});

describe('.store', function () {
var oldFsRename = fs.rename;

beforeEach(function (next) {

fs.rename = oldFsRename;


rimraf.sync(tempPackage);
copy.copyDir(testPackage, tempPackage, { ignore: ['.git'] })
.then(next.bind(next, null), next);
});

it('should move the canonical dir to source-md5/version/ folder if package meta has a version', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), '1.0.0'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should move the canonical dir to source-md5/target/ folder if package meta has no version', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'some-branch'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), 'some-branch'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should move the canonical dir to source-md5/_wildcard/ folder if package meta has no version and target is *', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), '_wildcard'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should overwrite if the exact same package source/version exists', function (next) {
var cachePkgDir = path.join(cacheDir, md5('foo'), '1.0.0-rc.blehhh');

mkdirp.sync(cachePkgDir);
fs.writeFileSync(path.join(cachePkgDir, '_bleh'), 'w00t');

resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0-rc.blehhh',
_source: 'foo',
_target: '*'
})
.then(function (dir) {
expect(dir).to.equal(cachePkgDir);
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);
expect(fs.existsSync(path.join(cachePkgDir, '_bleh'))).to.be(false);

next();
})
.done();
});

it('should read the package meta if not present', function (next) {
var pkgMeta = path.join(tempPackage, '.bower.json');


copy.copyFile(path.join(tempPackage, 'component.json'), pkgMeta)
.then(function () {
return Q.nfcall(fs.readFile, pkgMeta)
.then(function (contents) {
var json = JSON.parse(contents.toString());

json._target = '~0.2.0';
json._source = 'git://github.com/bower/test-package.git';

return Q.nfcall(fs.writeFile, pkgMeta, JSON.stringify(json, null, '  '));
});
})

.then(function () {
return resolveCache.store(tempPackage);
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('git://github.com/bower/test-package.git'), '0.2.0'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should error out when reading the package meta if the file does not exist', function (next) {
resolveCache.store(tempPackage)
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('ENOENT');
expect(err.message).to.contain(path.join(tempPackage, '.bower.json'));

next();
})
.done();
});

it('should error out when reading an invalid package meta', function (next) {
var pkgMeta = path.join(tempPackage, '.bower.json');

return Q.nfcall(fs.writeFile, pkgMeta, 'w00t')
.then(function () {
return resolveCache.store(tempPackage)
.then(function () {
next(new Error('Should have failed'));
}, function (err) {
expect(err).to.be.an(Error);
expect(err.code).to.equal('EMALFORMED');
expect(err.message).to.contain(path.join(tempPackage, '.bower.json'));

next();
});
})
.done();
});

it('should move the canonical dir, even if it is in a different drive', function (next) {
var hittedMock = false;

fs.rename = function (src, dest, cb) {
hittedMock = true;

setTimeout(function () {
var err = new Error();
err.code = 'EXDEV';
cb(err);
}, 10);
};

resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'some-branch'
})
.then(function (dir) {

expect(hittedMock).to.be(true);

expect(dir).to.equal(path.join(cacheDir, md5('foo'), 'some-branch'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should update the in-memory cache', function (next) {

resolveCache.versions('test-in-memory')

.then(function () {
return copy.copyDir(tempPackage, tempPackage2, { ignore: ['.git'] });
})

.then(function () {
return resolveCache.store(tempPackage, {
name: 'foo',
version: '1.0.0',
_source: 'test-in-memory',
_target: '*'
});
})
.then(function () {
return resolveCache.store(tempPackage2, {
name: 'foo',
version: '1.0.1',
_source: 'test-in-memory',
_target: '*'
});
})

.then(function () {
return resolveCache.versions('test-in-memory')
.then(function (versions) {
expect(versions).to.eql(['1.0.1', '1.0.0']);

next();
});
})
.done();
});

it('should url encode target when storing to the fs', function (next) {
resolveCache.store(tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'foo/bar'
})
.then(function (dir) {
expect(dir).to.equal(path.join(cacheDir, md5('foo'), 'foo%2Fbar'));
expect(fs.existsSync(dir)).to.be(true);
expect(fs.existsSync(path.join(dir, 'baz'))).to.be(true);
expect(fs.existsSync(tempPackage)).to.be(false);

next();
})
.done();
});

it('should be possible to store two package at same time', function (next) {
var store = resolveCache.store.bind(resolveCache, tempPackage, {
name: 'foo',
_source: 'foo',
_target: 'foo/bar'
});
var store2 = resolveCache.store.bind(resolveCache, tempPackage2, {
name: 'foo',
_source: 'foo',
