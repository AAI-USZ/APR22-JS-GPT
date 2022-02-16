var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../../core/PackageRepository');
var semver = require('../../util/semver');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(logger, endpoints, options, config) {
var decEndpoints;
var names;

options = options || {};
config = defaultConfig(config);


if (endpoints && !endpoints.length) {
endpoints = null;
}


if (endpoints) {
decEndpoints = endpoints.map(function (endpoint) {
return endpointParser.decompose(endpoint);
});
names = decEndpoints.map(function (decEndpoint) {
return decEndpoint.name || decEndpoint.source;
});
}

return Q.all([
clearPackages(decEndpoints, config, logger),
clearLinks(names, config, logger)
])
.spread(function (entries) {
return entries;
});
}

function clearPackages(decEndpoints, config, logger) {
var repository =  new PackageRepository(config, logger);

