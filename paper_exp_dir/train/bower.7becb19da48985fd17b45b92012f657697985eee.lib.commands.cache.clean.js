var EventEmitter = require('events').EventEmitter;
var fs = require('graceful-fs');
var mout = require('mout');
var Q = require('q');
var rimraf = require('rimraf');
var RegistryClient = require('bower-registry-client');
var PackageRepository = require('../../core/PackageRepository');
var Logger = require('../../core/Logger');
var cli = require('../../util/cli');
var defaultConfig = require('../../config');

function clean(packages, options, config) {
var emitter = new EventEmitter();
var logger = new Logger();
var names;

options = options || {};
config = mout.object.deepMixIn(config || {}, defaultConfig);


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
clearRegistry(names, config),
clearLinks(names, config),
!names ? clearCompletion(config) : null
])
.spread(function (entries) {
emitter.emit('end', entries);
})
.fail(function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}

function clearPackages(packages, config, logger) {
var repository =  new PackageRepository(config, logger);
