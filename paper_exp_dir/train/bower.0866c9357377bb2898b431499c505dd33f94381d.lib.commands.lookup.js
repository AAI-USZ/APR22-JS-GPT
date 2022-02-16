var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var RegistryClient = require('bower-registry-client');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function lookup(name, config) {
var registryClient;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
config.cache = config.storage.registry;

registryClient = new RegistryClient(config, logger);

Q.nfcall(registryClient.lookup.bind(registryClient), name)
.then(function (entry) {


return !entry ? null : {
name: name,
url: entry && entry.url
};
})
.done(function (result) {
logger.emit('end', result);
}, function (error) {
logger.emit('error', error);
});

return logger;
}
