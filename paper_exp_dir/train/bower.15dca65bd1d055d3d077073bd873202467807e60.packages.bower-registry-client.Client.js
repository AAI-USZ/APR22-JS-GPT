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
config.ca = config.ca || {};

if (config.ca.search && !Array.isArray(config.ca.search)) {
config.ca.search = [config.ca.search];
}
}


if (!config.cache) {
config.cache = path.join(os.tmpdir ? os.tmpdir() : os.tmpDir(), 'bower-registry');
}


if (typeof config.timeout !== 'number') {
config.timeout = 60000;
}


config.strictSsl = config.strictSsl == null ? true : !!config.strictSsl;


this._initCache();
}


RegistryClient.prototype.lookup = methods.lookup;
RegistryClient.prototype.search = methods.search;
RegistryClient.prototype.list = methods.list;
RegistryClient.prototype.register = methods.register;

RegistryClient.prototype.clearCache = function (name, callback) {
if (typeof name === 'function') {
callback = name;
name = null;
}

async.parallel([
this.lookup.clearCache.bind(this, name),
this.search.clearCache.bind(this, name),
this.list.clearCache.bind(this)
], callback);
};

RegistryClient.prototype.resetCache = function (name) {
this.lookup.resetCache.call(this, name);
this.search.resetCache.call(this, name);
this.list.resetCache.call(this);

return this;
};

RegistryClient.clearRuntimeCache = function () {
Cache.clearRuntimeCache();
};



RegistryClient.prototype._initCache = function () {
var cache;
var dir = this._config.cache;



cache = this.constructor._cache = this.constructor._cache || {};
this._cache = cache[dir] = cache[dir] || {};

this.lookup.initCache.call(this);
this.search.initCache.call(this);
this.list.initCache.call(this);
};

module.exports = RegistryClient;
