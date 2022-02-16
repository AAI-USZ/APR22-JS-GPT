var path = require('path');
var mout = require('mout');
var rimraf = require('../../lib/util/rimraf');
var fs = require('../../lib/util/fs');
var Q = require('q');
var expect = require('expect.js');
var mkdirp = require('mkdirp');
var md5 = require('md5-hex');
var ResolveCache = require('../../lib/core/ResolveCache');
var defaultConfig = require('../../lib/config');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');

describe('ResolveCache', function() {
var resolveCache;
var testPackage = path.resolve(__dirname, '../assets/package-a');
var tempPackage = path.resolve(__dirname, '../tmp/temp-package');
var tempPackage2 = path.resolve(__dirname, '../tmp/temp2-package');
var cacheDir = path.join(__dirname, '../tmp/temp-resolve-cache');

before(function(next) {

rimraf.sync(cacheDir);


resolveCache = new ResolveCache(
defaultConfig({
storage: {
packages: cacheDir
}
})
);


cmd('git', ['checkout', '0.2.0'], { cwd: testPackage }).then(
next.bind(next, null),
next
);
});

beforeEach(function() {

resolveCache.reset();
});

after(function() {

rimraf.sync(cacheDir);
});

describe('.constructor', function() {
beforeEach(function() {

rimraf.sync(tempPackage);
});
after(function() {

rimraf.sync(tempPackage);
});

function initialize(cacheDir) {
return new ResolveCache(
defaultConfig({
storage: {
packages: cacheDir
}
})
);
}

it("should create the cache folder if it doesn't exists", function() {
initialize(tempPackage);
expect(fs.existsSync(tempPackage)).to.be(true);
});

it('should not error out if the cache folder already exists', function() {
mkdirp.sync(tempPackage);
initialize(tempPackage);
});
});

describe('.store', function() {
var oldFsRename = fs.rename;

beforeEach(function(next) {

fs.rename = oldFsRename;


rimraf.sync(tempPackage);
copy.copyDir(testPackage, tempPackage, { ignore: ['.git'] }).then(
next.bind(next, null),
next
);
});

it('should move the canonical dir to source-md5/version/ folder if package meta has a version', function(next) {
resolveCache
.store(tempPackage, {
name: 'foo',
