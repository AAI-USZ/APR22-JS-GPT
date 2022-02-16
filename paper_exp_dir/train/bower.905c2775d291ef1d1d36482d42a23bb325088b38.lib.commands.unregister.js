var chalk = require('chalk');
var Q = require('q');

var defaultConfig = require('../config');
var PackageRepository = require('../core/PackageRepository');
var Tracker = require('../util/analytics').Tracker;
var createError = require('../util/createError');

function unregister(logger, name, config) {

if (!name) {
return;
}

var repository;
var registryClient;
var tracker;
var force;

config = defaultConfig(config);
force = config.force;
tracker = new Tracker(config);


config.offline = false;
config.force = true;


name = name.trim();

repository = new PackageRepository(config, logger);

tracker.track('unregister');

if (!config.accessToken) {
return logger.emit('error',
createError('Use "bower login" with collaborator credentials', 'EFORBIDDEN')
);
}

return Q.resolve()
.then(function () {
