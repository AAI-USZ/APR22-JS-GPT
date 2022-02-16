var expect = require('expect.js');
var Q = require('q');
var path = require('path');
var mout = require('mout');
var fs = require('graceful-fs');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var proxyquire = require('proxyquire');
var defaultConfig = require('../../lib/config');
var Logger = require('../../lib/core/Logger');
var ResolveCache = require('../../lib/core/ResolveCache');
var resolvers = require('../../lib/core/resolvers');
var copy = require('../../lib/util/copy');

describe('PackageRepository', function () {
var packageRepository;
var resolver;
var resolverFactoryHook;
var resolverFactoryClearHook;
var testPackage = path.resolve(__dirname, '../assets/github-test-package');
var tempPackage = path.resolve(__dirname, '../assets/temp');
var packagesCacheDir = path.join(__dirname, '../assets/temp-resolve-cache');
var registryCacheDir = path.join(__dirname, '../assets/temp-registry-cache');
var mockSource = 'file://' + testPackage;

beforeEach(function (next) {
var PackageRepository;
var config;
var logger = new Logger();


config = mout.object.deepMixIn({}, defaultConfig, {
storage: {
packages: packagesCacheDir,
registry: registryCacheDir
}
});


function resolverFactory(decEndpoint, _config, _logger, _registryClient) {
expect(_config).to.eql(config);
expect(_logger).to.be.an(Logger);
expect(_registryClient).to.be.an(RegistryClient);

decEndpoint = mout.object.deepMixIn({}, decEndpoint);
decEndpoint.source = mockSource;

resolver = new resolvers.GitRemote(decEndpoint, _config, _logger);
