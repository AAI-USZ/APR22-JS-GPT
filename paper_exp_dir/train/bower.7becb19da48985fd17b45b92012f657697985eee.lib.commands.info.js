var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function info(pkg, property, config) {
var repository;
var emitter = new EventEmitter();
var logger = new Logger();

config = mout.object.deepMixIn(config || {}, defaultConfig);
repository = new PackageRepository(config, logger);

pkg = pkg.split('#');
pkg = {
name: pkg[0],
version: pkg[1]
};


if (!pkg.version) {
repository.versions(pkg.name)
.then(function (versions) {
emitter.emit('end', {
name: pkg.name,
versions: versions
});
})
.fail(function (error) {
emitter.emit('error', error);
});

} else {
repository.fetch({
source: pkg.name,
target: pkg.version
})
