var mout = require('mout');
var Q = require('q');
var chalk = require('chalk');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('bower-logger');
var Config = require('bower-config');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');
var GitHubResolver = require('../core/resolvers/GitHubResolver');

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



if (config.registry.register === Config.DEFAULT_REGISTRY) {
url = convertUrl(url, logger);

if (!mout.string.startsWith(url, 'git://')) {
return logger.emit('error', createError('The registry only accepts URLs starting with git://', 'EINVFORMAT'));
}
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


return Q.nfcall(logger.prompt.bind(logger), {
type: 'confirm',
message: 'Registering a package will make it installable via the registry (' +
chalk.cyan.underline(config.registry.register) + '), continue?',
default: true
});
})
.then(function (result) {

if (!result) {
return;
}


registryClient = repository.getRegistryClient();

logger.action('register', url, {
name: name,
url: url
});

return Q.nfcall(registryClient.register.bind(registryClient), name, url);
})
.done(function (result) {
logger.emit('end', result);
}, function (error) {
logger.emit('error', error);
});
});

return logger;
}

function convertUrl(url, logger) {
var pair;
