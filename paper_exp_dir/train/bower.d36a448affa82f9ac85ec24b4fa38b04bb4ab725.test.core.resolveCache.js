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
var testPackage = path.resolve(__dirname, '../assets/github-test-package');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var tempPackage2 = path.resolve(__dirname, '../assets/temp2');
var cacheDir = path.join(__dirname, '../assets/temp-resolve-cache');

before(function (next) {

rimraf.sync(cacheDir);


resolveCache = new ResolveCache(mout.object.deepMixIn(defaultConfig, {
storage: {
packages: cacheDir
