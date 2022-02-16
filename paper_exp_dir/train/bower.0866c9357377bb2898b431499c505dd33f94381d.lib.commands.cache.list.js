var mout = require('mout');
var Logger = require('bower-logger');
var PackageRepository = require('../../core/PackageRepository');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function list(packages, options, config) {
var repository;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
repository = new PackageRepository(config, logger);


if (packages && !packages.length) {
packages = null;
}

repository.list()
.then(function (entries) {
if (packages) {

entries = entries.filter(function (entry) {
return !!mout.array.find(packages, function (pkg) {
return pkg === entry.pkgMeta.name;
});
});
}

return entries;
})
.done(function (entries) {
logger.emit('end', entries);
}, function (error) {
logger.emit('error', error);
});

return logger;
}


