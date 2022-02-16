var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../../core/PackageRepository');
var semver = require('../../util/semver');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(endpoints, options, config) {
var logger = new Logger();
var decEndpoints;
var names;

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);


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

Q.all([
clearPackages(decEndpoints, config, logger),
clearLinks(names, config, logger),
!names ? clearCompletion(config, logger) : null
])
.spread(function (entries) {
logger.emit('end', entries);
})
.fail(function (error) {
logger.emit('error', error);
});

return logger;
}

function clearPackages(decEndpoints, config, logger) {
var repository =  new PackageRepository(config, logger);

return repository.list()
.then(function (entries) {
var promises;


if (decEndpoints) {
entries = entries.filter(function (entry) {
return !!mout.array.find(decEndpoints, function (decEndpoint) {
var entryPkgMeta = entry.pkgMeta;


if  (decEndpoint.name !== entryPkgMeta.name &&
decEndpoint.source !== entryPkgMeta.name &&
decEndpoint.source !== entryPkgMeta._source
) {
return false;
}


if (decEndpoint.target === '*') {
return true;
}


if (semver.validRange(decEndpoint.target)) {
