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

after(function () {
rimraf.sync(registryCacheDir);
rimraf.sync(packagesCacheDir);
});

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
resolverFactoryHook(resolver);

return Q.resolve(resolver);
}
resolverFactory.getConstructor = function () {
return Q.resolve([resolvers.GitRemote, 'file://' + testPackage, false]);
};
resolverFactory.clearRuntimeCache = function () {
resolverFactoryClearHook();
};

PackageRepository = proxyquire('../../lib/core/PackageRepository', {
'./resolverFactory': resolverFactory
});
packageRepository = new PackageRepository(config, logger);


resolverFactoryHook = resolverFactoryClearHook = function () {};


rimraf.sync(tempPackage);


packageRepository.clear()
.then(next.bind(next, null), next);
});

describe('.constructor', function () {
it('should pass the config correctly to the registry client, including its cache folder', function () {
expect(packageRepository._registryClient._config.cache).to.equal(registryCacheDir);
});
});

describe('.fetch', function () {
it('should call the resolver factory to get the appropriate resolver', function (next) {
var called;

resolverFactoryHook = function () {
called = true;
};

packageRepository.fetch({ name: '', source: 'foo', target: '~0.1.0' })
.spread(function (canonicalDir, pkgMeta) {
expect(called).to.be(true);
