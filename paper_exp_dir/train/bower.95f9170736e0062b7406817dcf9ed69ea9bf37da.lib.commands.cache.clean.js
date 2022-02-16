var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var PackageRepository = require('../../core/PackageRepository');
var Logger = require('../../core/Logger');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(packages, options, config) {
var promise;
var emitter = new EventEmitter();
var logger = new Logger();

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);


if (packages && !packages.length) {
packages = null;

} else {
packages = packages.map(function (pkg) {
var split = pkg.split('#');
return {
name: split[0],
version: split[1]
};
});
}

if (!options.completion) {
promise = cleanPackages(config, logger, packages);
} else {
promise = Q.all([
packages ? cleanPackages(config, logger, packages) : null,
cleanCompletion(config, logger)
]);
}

promise
.then(function (entries) {
emitter.emit('end', entries);
}, function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}

function cleanPackages(config, logger, packages) {
var repository =  new PackageRepository(config, logger);

return repository.list()
.then(function (entries) {
var promises;


if (packages) {
entries = entries.filter(function (pkgMeta) {
return !!mout.array.find(packages, function (pkg) {

if  (pkg.name !== pkgMeta.name) {
return false;
}


if (pkg.version) {
return pkg.version === pkgMeta.version ||
pkg.version === pkgMeta.target;
}
