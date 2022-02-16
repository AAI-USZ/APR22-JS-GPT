var Q = require('q');
var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var url = require('url');
var resolvers = require('./resolvers');
var createError = require('../util/createError');

function createInstance(decEndpoint, config, logger, registryClient) {
return getConstructor(decEndpoint.source, config, registryClient)
.spread(function (ConcreteResolver, source, fromRegistry) {
var decEndpointCopy = mout.object.pick(decEndpoint, ['name', 'target']);

decEndpointCopy.source = source;


if (fromRegistry) {
decEndpoint.registry = true;

