var mout = require('mout');
var Logger = require('bower-logger');
var PackageRepository = require('../core/PackageRepository');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

var packageRepository;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

packageRepository = new PackageRepository(config, logger);


packageRepository.fetch({ name: '', source: name, target: '*' })
.spread(function (canonicalDir, pkgMeta) {
var homepage = pkgMeta.homepage;




if (!homepage) {
homepage = guessHomepage(pkgMeta);
}


if (!homepage) {
return logger.emit('error', createError('No homepage set for ' + name, 'ENOHOME'));
}


