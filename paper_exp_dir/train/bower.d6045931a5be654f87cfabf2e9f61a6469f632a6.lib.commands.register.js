var mout = require('mout');
var Q = require('q');
var promptly = require('promptly');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('bower-logger');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function register(name, url, config) {
var repository;
var registryClient;
var logger = new Logger();
var force;

config = mout.object.deepFillIn(config || {}, defaultConfig);
force = config.force;


config.offline = false;
config.force = true;


name = name.trim();

process.nextTick(function () {


if (!name) {
return logger.emit('error', createError('Please type a name', 'EINVNAME'));
}


url = convertUrl(url, logger);



if (!mout.string.startsWith(url, 'git://')) {
return logger.emit('error', createError('The registry only accepts URLs starting with git://', 'EINVFORMAT'));
}



repository = new PackageRepository(config, logger);
repository.fetch({ name: name, source: url, target: '*' })
.spread(function (canonicalDir, pkgMeta) {
if (pkgMeta.private) {
throw createError('The package you are trying to register is marked as private', 'EPRIV');
}


if (!config.interactive || force) {
return true;
}


