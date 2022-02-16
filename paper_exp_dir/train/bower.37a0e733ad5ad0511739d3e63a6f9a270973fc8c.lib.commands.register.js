var EventEmitter = require('events').EventEmitter;
var mout = require('mout');
var Q = require('q');
var promptly = require('promptly');
var RegistryClient = require('bower-registry-client');
var PackageRepository = require('../core/PackageRepository');
var Logger = require('../core/Logger');
var cli = require('../util/cli');
var createError = require('../util/createError');
var defaultConfig = require('../config');

function register(name, url, config) {
var repository;
var registryClient;
var emitter = new EventEmitter();
var logger = new Logger();
var force;

config = mout.object.deepMixIn(config || {}, defaultConfig);
force = config.force;


config.offline = false;
config.force = true;



if (!mout.string.startsWith(url, 'git://')) {
process.nextTick(function () {
emitter.emit('error', createError('The registry only accepts URLs starting with git://', 'EINVFORMAT'));
});

return emitter;
}



repository = new PackageRepository(config, logger);
repository.fetch({ name: '', source: url, target: '*' })
.then(function () {

if (!config.interactive || force) {
return true;
}


return Q.nfcall(promptly.confirm, 'Registering a package will make it visible and installable via the registry, continue? (y/n)');
})
.then(function (result) {

if (!result) {
return;
}


logger.action('register', url, {
name: name,
url: url
});

config.cache = config.storage.registry;
registryClient = new RegistryClient(config);

return Q.nfcall(registryClient.register.bind(registryClient), name, url);
})
.then(function (result) {
emitter.emit('end', result);
})
.fail(function (error) {
emitter.emit('error', error);
});

return logger.pipe(emitter);
}



register.line = function (argv) {
var options = register.options(argv);
var name = options.argv.remain[1];
var url = options.argv.remain[2];

if (!name || !url) {
return null;
}

return register(name, url);
};

register.options = function (argv) {
return cli.readOptions(argv);
};

register.completion = function () {

};

module.exports = register;
