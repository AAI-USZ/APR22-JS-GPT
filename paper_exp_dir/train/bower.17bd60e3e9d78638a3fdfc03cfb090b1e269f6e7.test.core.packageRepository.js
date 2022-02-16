var expect = require('expect.js');
var Q = require('q');
var path = require('path');
var mout = require('mout');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var Logger = require('bower-logger');
var proxyquire = require('proxyquire');
var defaultConfig = require('../../lib/config');
var ResolveCache = require('../../lib/core/ResolveCache');
var resolvers = require('../../lib/core/resolvers');
var copy = require('../../lib/util/copy');

describe('PackageRepository', function () {
var packageRepository;
var resolver;
var resolverFactoryHook;
var resolverFactoryClearHook;
var testPackage = path.resolve(__dirname, '../assets/package-a');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var packagesCacheDir = path.join(__dirname, '../assets/temp-resolve-cache');
var registryCacheDir = path.join(__dirname, '../assets/temp-registry-cache');
var mockSource = 'file://' + testPackage;
var forceCaching = true;

after(function () {
rimraf.sync(registryCacheDir);
rimraf.sync(packagesCacheDir);
});

beforeEach(function (next) {
var PackageRepository;
var config;
