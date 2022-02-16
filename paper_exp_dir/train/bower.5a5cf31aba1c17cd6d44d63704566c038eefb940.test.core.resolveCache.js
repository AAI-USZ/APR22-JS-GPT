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

it('should read the package meta if not present', function (next) {
var pkgMeta = path.join(tempPackage, '.bower.json');


copy.copyFile(path.join(tempPackage, 'component.json'), pkgMeta)
.then(function () {
return Q.nfcall(fs.readFile, pkgMeta)
.then(function (contents) {
var json = JSON.parse(contents.toString());

json._target = '~0.2.0';
