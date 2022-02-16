var async = require('async');
var methods = require('./lib');
var Cache = require('./lib/util/Cache');

function RegistryClient(config, logger) {
this._logger = logger;
this._config = config;

if (!this._config.registry) {
throw new Error("You need to pass config as read by bower-config module. Registry field is missing.");
}
