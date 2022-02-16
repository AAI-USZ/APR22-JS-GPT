var Q = require('q');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

var pluginResolverFactory = require('./resolvers/pluginResolverFactory');

function createInstance(decEndpoint, options, registryClient) {
decEndpoint = mout.object.pick(decEndpoint, ['name', 'target', 'source']);

return getConstructor(decEndpoint, options, registryClient)
.spread(function (ConcreteResolver, decEndpoint) {
return new ConcreteResolver(decEndpoint, options.config, options.logger);
});
}

function getConstructor(decEndpoint, options, registryClient) {
