var Q = require('q');
var fs = require('../util/fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');
var resolve = require('../util/resolve');

var pluginResolverFactory = require('./resolvers/pluginResolverFactory');

function createInstance(decEndpoint, options, registryClient) {
decEndpoint = mout.object.pick(decEndpoint, ['name', 'target', 'source']);

options.version = require('../version');

return getConstructor(decEndpoint, options, registryClient)
.spread(function (ConcreteResolver, decEndpoint) {
return new ConcreteResolver(decEndpoint, options.config, options.logger);
});
}

function getConstructor(decEndpoint, options, registryClient) {
var source = decEndpoint.source;
var config = options.config;





var promise = Q.resolve();

var addResolver = function (resolverFactory) {
promise = promise.then(function (result) {
if (result === undefined) {
return resolverFactory(decEndpoint, options);
} else {
return result;
}
});
};





addResolver(function () {
var selectedResolver;
var resolverNames;

if (Array.isArray(config.resolvers)) {
resolverNames = config.resolvers;
} else if (!!config.resolvers) {
resolverNames = config.resolvers.split(',');
} else {
resolverNames = [];
}

var resolverPromises = resolverNames.map(function (resolverName) {


var resolver = resolvers[resolverName];

if (resolver === undefined) {
var resolverPath = resolve(resolverName, { cwd: config.cwd });

if (resolverPath === undefined) {
throw createError('Bower resolver not found: ' + resolverName, 'ENORESOLVER')
}
