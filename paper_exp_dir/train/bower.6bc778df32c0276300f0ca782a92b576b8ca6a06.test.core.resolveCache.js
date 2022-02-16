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

