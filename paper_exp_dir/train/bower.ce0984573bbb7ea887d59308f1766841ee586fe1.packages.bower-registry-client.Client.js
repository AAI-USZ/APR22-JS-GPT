var os = require('os');
var path = require('path');
var async = require('async');
var deepExtend = require('deep-extend');
var methods = require('./lib');
var Cache = require('./lib/util/Cache');

function RegistryClient(config, logger) {
var bowerRegistry = 'https://bower.herokuapp.com';

config = config || {};
this._config = config;
this._logger = logger;



config.registry = config.registry || bowerRegistry;
if (typeof config.registry === 'string') {
config.registry = {
search: [config.registry],
register: config.registry,
publish: config.registry
};
} else {
config.registry = deepExtend({
search: bowerRegistry,
register: bowerRegistry,
publish: bowerRegistry
}, config.registry);

if (!Array.isArray(config.registry.search)) {
config.registry.search = [config.registry.search];
}
}


config.registry.search = config.registry.search.map(function (url) {
return url.replace(/\/+$/, '');
});
config.registry.register = config.registry.register.replace(/\/+$/, '');
config.registry.publish = config.registry.publish.replace(/\/+$/, '');


if (typeof config.ca === 'string') {
config.ca = {
search: [config.ca],
register: config.ca,
publish: config.ca
};
} else {
config.ca = deepExtend({
search: []
}, config.ca);

if (!Array.isArray(config.ca.search)) {
config.ca.search = [config.ca.search];
}
}


