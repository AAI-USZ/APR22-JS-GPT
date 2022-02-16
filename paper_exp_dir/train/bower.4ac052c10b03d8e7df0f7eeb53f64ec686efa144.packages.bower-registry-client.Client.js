var os = require('os');
var path = require('path');
var methods = require('./lib');

var name;

function RegistryClient(config) {
config = config || {};
this._config = config;



config.registry = config.registry || 'https://bower.herokuapp.com';
if (typeof config.registry === 'string') {
config.registry = {
search: [config.registry],
register: config.registry,
publish: config.registry
};
} else if (!Array.isArray(config.registry.search)) {
