var async = require('async');
var methods = require('./lib');
var Cache = require('./lib/util/Cache');

function RegistryClient(config, logger) {
this._logger = logger;
this._config = config;

if (!this._config.registry) {
throw new Error(
'You need to pass config as read by bower-config module. Registry field is missing.'
);
}


if (!Object.prototype.hasOwnProperty.call(this._config, 'cache')) {
this._config.cache = this._config.storage
? this._config.storage.registry
: null;
