var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var defaultConfig = require('../../config');

function list(logger, packages, options, config) {
var repository;

config = defaultConfig(config);
repository = new PackageRepository(config, logger);


if (packages && !packages.length) {
packages = null;
}

return repository.list().then(function(entries) {
if (packages) {

entries = entries.filter(function(entry) {
return !!mout.array.find(packages, function(pkg) {
return pkg === entry.pkgMeta.name;
});
});
}

return entries;
