var Q = require('q');
var fs = require('../util/fs');
var path = require('path');
var mout = require('mout');
var resolvers = require('./resolvers');
var createError = require('../util/createError');
var requireg = require('requireg');

var pluginResolverFactory = require('./resolvers/pluginResolverFactory');

function createInstance(decEndpoint, options, registryClient) {
decEndpoint = mout.object.pick(decEndpoint, ['name', 'target', 'source']);

options.version = require('../version');

return getConstructor(decEndpoint, options, registryClient)
