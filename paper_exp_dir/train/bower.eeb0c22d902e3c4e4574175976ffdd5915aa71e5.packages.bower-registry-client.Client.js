var os = require('os');
var path = require('path');
var async = require('async');
var methods = require('./lib');
var Cache = require('./lib/util/Cache');

function RegistryClient(config, logger) {
config = config || {};
this._config = config;
this._logger = logger;



config.registry = config.registry || 'https://bower.herokuapp.com';
if (typeof config.registry === 'string') {
config.registry = {
search: [config.registry],
register: config.registry,
publish: config.registry
};
