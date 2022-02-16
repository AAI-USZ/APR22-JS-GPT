var path = require('path');
var mout = require('mout');
var rimraf = require('rimraf');
var fs = require('graceful-fs');
var Q = require('q');
var expect = require('expect.js');
var ResolveCache = require('../../lib/core/ResolveCache');
var defaultConfig = require('../../lib/config');
var cmd = require('../../lib/util/cmd');
var copy = require('../../lib/util/copy');
var md5 = require('../../lib/util/md5');

describe('ResolveCache', function () {
var resolveCache;
var testPackage = path.resolve(__dirname, '../assets/github-test-package');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var cacheDir = path.join(__dirname, '../assets/resolve-cache');

before(function (next) {
resolveCache = new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
}
}));


cmd('git', ['checkout', '0.2.0'], { cwd: testPackage })
.then(next.bind(next, null), next);
});

after(function () {
rimraf.sync(cacheDir);
});

describe('.constructor', function () {

});

describe('.store', function () {
var oldFsRename = fs.rename;

beforeEach(function (next) {

fs.rename = oldFsRename;


rimraf.sync(tempPackage);
copy.copyDir(testPackage, tempPackage)
.then(next.bind(next, null), next);
});

