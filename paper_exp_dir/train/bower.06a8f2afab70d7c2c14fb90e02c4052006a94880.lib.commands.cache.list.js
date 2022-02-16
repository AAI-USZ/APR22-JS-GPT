var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function list(logger, packages, options, config) {
var repository;

config = defaultConfig(config);
repository = new PackageRepository(config, logger);


if (packages && !packages.length) {
packages = null;
}

return repository.list()
.then(function (entries) {
if (packages) {

entries = entries.filter(function (entry) {
return !!mout.array.find(packages, function (pkg) {
return pkg === entry.pkgMeta.name;
});
});
}

return entries;
});
}



list.line = function (logger, argv) {
var options = cli.readOptions(argv);
var packages = options.argv.remain.slice(2);
return list(logger, packages, options);
};

list.completion = function () {

};

module.exports = list;
