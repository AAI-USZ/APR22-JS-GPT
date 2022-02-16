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
.then(function () {

if (!config.interactive || force) {
return true;
}


return Q.nfcall(promptly.confirm, 'Registering a package will make it visible and installable via the registry (' +
config.registry.register.cyan.underline + '), continue? (y/n)');
})
.then(function (result) {

if (!result) {
return;
}


registryClient = repository.getRegistryClient();
