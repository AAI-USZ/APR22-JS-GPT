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
]);
};
resolverFactory.clearRuntimeCache = function() {
resolverFactoryClearHook();
};

PackageRepository = proxyquire('../../lib/core/PackageRepository', {
'./resolverFactory': resolverFactory
});
packageRepository = new PackageRepository(config, logger);


resolverFactoryHook = resolverFactoryClearHook = function() {};


rimraf.sync(tempPackage);


packageRepository.clear().then(next.bind(next, null), next);
});

describe('.constructor', function() {
it('should pass the config correctly to the registry client, including its cache folder', function() {
expect(packageRepository._registryClient._config.cache).to.equal(
registryCacheDir
);
});
});

describe('.fetch', function() {
it('should call the resolver factory to get the appropriate resolver', function(next) {
var called;

resolverFactoryHook = function() {
called = true;
};

packageRepository
.fetch({ name: '', source: 'foo', target: '~0.1.0' })
.spread(function(canonicalDir, pkgMeta) {
expect(called).to.be(true);
expect(fs.existsSync(canonicalDir)).to.be(true);
expect(pkgMeta).to.be.an('object');
expect(pkgMeta.name).to.be('package-a');
expect(pkgMeta.version).to.be('0.1.1');
next();
})
.done();
});

it('should just call the resolver resolve method if force was specified', function(next) {
var called = [];

resolverFactoryHook = function(resolver) {
var originalResolve = resolver.resolve;

resolver.resolve = function() {
called.push('resolve');
return originalResolve.apply(this, arguments);
};

resolver.hasNew = function() {
called.push('hasNew');
return Q.resolve(false);
};
};

packageRepository._resolveCache.retrieve = function() {
called.push('retrieve');
return Q.resolve([]);
};

packageRepository._config.force = true;
packageRepository
.fetch({ name: '', source: 'foo', target: ' ~0.1.0' })
.spread(function(canonicalDir, pkgMeta) {
expect(called).to.eql(['resolve']);
expect(fs.existsSync(canonicalDir)).to.be(true);
expect(pkgMeta).to.be.an('object');
expect(pkgMeta.name).to.be('package-a');
expect(pkgMeta.version).to.be('0.1.1');
next();
})
.done();
});

it('should attempt to retrieve a resolved package from the resolve package', function(next) {
var called = false;
var originalRetrieve = packageRepository._resolveCache.retrieve;

packageRepository._resolveCache.retrieve = function(source) {
called = true;
expect(source).to.be(mockSource);
return originalRetrieve.apply(this, arguments);
};

packageRepository
.fetch({ name: '', source: 'foo', target: '~0.1.0' })
.spread(function(canonicalDir, pkgMeta) {
expect(called).to.be(true);
expect(fs.existsSync(canonicalDir)).to.be(true);
expect(pkgMeta).to.be.an('object');
expect(pkgMeta.name).to.be('package-a');
expect(pkgMeta.version).to.be('0.1.1');
next();
})
.done();
});

it('should avoid using cache for local resources', function(next) {
forceCaching = false;

var called = false;
var originalRetrieve = packageRepository._resolveCache.retrieve;

packageRepository._resolveCache.retrieve = function(source) {
called = true;
expect(source).to.be(mockSource);
return originalRetrieve.apply(this, arguments);
};

packageRepository
.fetch({
name: '',
source: helpers.localSource(testPackage),
target: '~0.1.0'
})
.spread(function(canonicalDir, pkgMeta) {
expect(called).to.be(false);
expect(fs.existsSync(canonicalDir)).to.be(true);
expect(pkgMeta).to.be.an('object');
expect(pkgMeta.name).to.be('package-a');
expect(pkgMeta.version).to.be('0.1.1');
forceCaching = true;
next();
})
.done();
});

it('should just call the resolver resolve method if no appropriate package was found in the resolve cache', function(next) {
var called = [];

resolverFactoryHook = function(resolver) {
var originalResolve = resolver.resolve;

resolver.resolve = function() {
called.push('resolve');
return originalResolve.apply(this, arguments);
};

resolver.hasNew = function() {
called.push('hasNew');
};
};

packageRepository._resolveCache.retrieve = function() {
return Q.resolve([]);
};

packageRepository
.fetch({ name: '', source: 'foo', target: ' ~0.1.0' })
.spread(function(canonicalDir, pkgMeta) {
expect(called).to.eql(['resolve']);
expect(fs.existsSync(canonicalDir)).to.be(true);
expect(pkgMeta).to.be.an('object');
expect(pkgMeta.name).to.be('package-a');
expect(pkgMeta.version).to.be('0.1.1');
next();
})
.done();
});

it('should call the resolver hasNew method if an appropriate package was found in the resolve cache', function(next) {
var json = {
name: 'a',
version: '0.2.1'
};
var called;

resolverFactoryHook = function(resolver) {
var originalHasNew = resolver.hasNew;

resolver.hasNew = function(pkgMeta) {
expect(pkgMeta).to.eql(json);
called = true;
return originalHasNew.apply(this, arguments);
};
};

packageRepository._resolveCache.retrieve = function() {
return Q.resolve([tempPackage, json]);
};

copy.copyDir(testPackage, tempPackage, { ignore: ['.git'] })
.then(function() {
fs.writeFileSync(
path.join(tempPackage, '.bower.json'),
JSON.stringify(json)
);

return packageRepository
.fetch({ name: '', source: 'foo', target: '~0.1.0' })
.spread(function(canonicalDir, pkgMeta) {
