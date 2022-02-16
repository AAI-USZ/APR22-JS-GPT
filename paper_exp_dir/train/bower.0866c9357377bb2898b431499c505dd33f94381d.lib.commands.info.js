var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var endpointParser = require('bower-endpoint-parser');
var PackageRepository = require('../core/PackageRepository');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function info(endpoint, property, config) {
var repository;
var decEndpoint;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
repository = new PackageRepository(config, logger);

decEndpoint = endpointParser.decompose(endpoint);

Q.all([
getPkgMeta(repository, decEndpoint, property),
decEndpoint.target === '*' && !property ? repository.versions(decEndpoint.source) : null
])
.spread(function (pkgMeta, versions) {
if (versions) {
return {
name: decEndpoint.source,
versions: versions,
latest: pkgMeta
};
}

return pkgMeta;
})
.done(function (result) {
logger.emit('end', result);
}, function (error) {
logger.emit('error', error);
});

return logger;
