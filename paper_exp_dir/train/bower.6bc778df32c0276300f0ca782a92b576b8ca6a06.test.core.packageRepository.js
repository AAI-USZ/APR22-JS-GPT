var expect = require('expect.js');
var Q = require('q');
var path = require('path');
var mout = require('mout');
var fs = require('../../lib/util/fs');
var rimraf = require('../../lib/util/rimraf');
var RegistryClient = require('bower-registry-client');
var Logger = require('bower-logger');
var proxyquire = require('proxyquire');
var defaultConfig = require('../../lib/config');
var ResolveCache = require('../../lib/core/ResolveCache');
var resolvers = require('../../lib/core/resolvers');
var copy = require('../../lib/util/copy');
var helpers = require('../helpers');

describe('PackageRepository', function() {
var packageRepository;
var resolver;
var resolverFactoryHook;
var resolverFactoryClearHook;
var testPackage = path.resolve(__dirname, '../assets/package-a');
var tempPackage = path.resolve(__dirname, '../tmp/temp-package');
var packagesCacheDir = path.join(__dirname, '../tmp/temp-resolve-cache');
var registryCacheDir = path.join(__dirname, '../tmp/temp-registry-cache');
var mockSource = helpers.localSource(testPackage);

var forceCaching = true;

after(function() {
rimraf.sync(registryCacheDir);
rimraf.sync(packagesCacheDir);
});

beforeEach(function(next) {
var PackageRepository;
var config;
var logger = new Logger();


config = defaultConfig({
storage: {
packages: packagesCacheDir,
registry: registryCacheDir
}
});


function resolverFactory(decEndpoint, options, _registryClient) {
var _config = options.config;
var _logger = options.logger;

expect(_config).to.eql(config);
expect(_logger).to.be.an(Logger);
expect(_registryClient).to.be.an(RegistryClient);

decEndpoint = mout.object.deepMixIn({}, decEndpoint);
decEndpoint.source = mockSource;

resolver = new resolvers.GitRemote(decEndpoint, _config, _logger);

if (forceCaching) {

resolver.isCacheable = function() {
return true;
};
}

resolverFactoryHook(resolver);

return Q.resolve(resolver);
}
resolverFactory.getConstructor = function() {
return Q.resolve([
resolvers.GitRemote,
{
source: helpers.localSource(testPackage)
}
