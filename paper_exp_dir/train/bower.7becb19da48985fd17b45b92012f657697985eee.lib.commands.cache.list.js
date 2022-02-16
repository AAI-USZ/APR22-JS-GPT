var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var PackageRepository = require('../../core/PackageRepository');
var Logger = require('../../core/Logger');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function list(packages, options, config) {
var repository;
var emitter = new EventEmitter();
var logger = new Logger();

config = mout.object.deepMixIn(config || {}, defaultConfig);
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

emitter.emit('end', entries);
})
.fail(function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}



list.line = function (argv) {
var options = list.options(argv);
