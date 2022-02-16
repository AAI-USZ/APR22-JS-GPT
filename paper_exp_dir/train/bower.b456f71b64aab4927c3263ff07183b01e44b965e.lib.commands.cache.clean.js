var fs = require('graceful-fs');
var path = require('path');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var Logger = require('bower-logger');
var PackageRepository = require('../../core/PackageRepository');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(packages, options, config) {
var logger = new Logger();
var names;

options = options || {};
config = mout.object.deepFillIn(config || {}, defaultConfig);


if (packages && !packages.length) {
packages = names = null;

} else {
packages = packages.map(function (pkg) {
var split = pkg.split('#');
return {
name: split[0],
version: split[1]
};
});
names = packages.map(function (pkg) {
return pkg.name;
});
}

Q.all([
clearPackages(packages, config, logger),
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

function clearPackages(packages, config, logger) {
var repository =  new PackageRepository(config, logger);

return repository.list()
.then(function (entries) {
var promises;


if (packages) {
entries = entries.filter(function (entry) {
return !!mout.array.find(packages, function (pkg) {
var entryPkgMeta = entry.pkgMeta;


if  (pkg.name !== entryPkgMeta.name) {
return false;
}


if (pkg.version) {
return pkg.version === entryPkgMeta.version ||
pkg.version === entryPkgMeta._target ||
pkg.version === entryPkgMeta._release;
}

return true;
});
});
}

promises = entries.map(function (entry) {
return repository.eliminate(entry.pkgMeta)
