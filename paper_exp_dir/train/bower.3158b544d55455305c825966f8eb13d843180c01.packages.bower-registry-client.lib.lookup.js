var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var mkdirp = require('mkdirp');
var createError = require('./util/createError');
var Cache = require('./util/Cache');

function lookup(name, options, callback) {
var data;
var that = this;
var registry = this._config.registry.search;
var total = registry.length;
var index = 0;

if (typeof options === 'function') {
callback = options;
options = {};
} else if (!options) {
options = {};
}



if (!total) {
return callback(createError('Package "' + name + '" not found', 'ENOTFOUND'));
}



async.doUntil(function (next) {
var remote = url.parse(registry[index]);



if (!options.force) {
that._lookupCache[remote.host].get(name, function (err, value) {
data = value;




if (err || data || options.offline) {
return next(err);
}

doRequest(name, index, that._config, function (err, entry) {
if (err) {
return next(err);
}

data = entry;


that._lookupCache[remote.host].set(name, entry, getMaxAge(entry), next);
});
});


} else {
doRequest(name, index, that._config, function (err, entry) {
if (err) {
return next(err);
}

data = entry;


that._lookupCache[remote.host].set(name, entry, getMaxAge(entry), next);
});
}
}, function () {

return !!data || index++ < total;
}, function (err) {

if (err) {
return callback(err);
}


if (!data) {
return callback(createError('Package "' + name + '" not found', 'ENOTFOUND'));
}

callback(null, data);
});
}

function doRequest(name, index, config, callback) {
var requestUrl = config.registry.search[index] + '/packages/' + encodeURIComponent(name);
var remote = url.parse(requestUrl);
var headers = {};

if (config.userAgent) {
headers['User-Agent'] = config.userAgent;
}

request.get(requestUrl, {
proxy: remote.protocol === 'https:' ? config.httpsProxy : config.proxy,
ca: config.ca.search[index],
strictSSL: config.strictSsl,
timeout: config.timeout,
json: true
}, function (err, response, body) {

if (err) {
return callback(createError('Request to "' + requestUrl + '" failed: ' + err.message, err.code));
}


if (response.statusCode === 404) {
return callback();
}


if (response.statusCode < 200 || response.statusCode > 299) {
return callback(createError('Request to "' + requestUrl + '" failed with ' + response.statusCode, 'EINVRES'));
}



if (typeof body !== 'object') {
return callback(createError('Response of request to "' + requestUrl + '" is not a valid json', 'EINVRES'));
}

callback(null, {
type: 'alias',
url: body.url
});
});
}

function getMaxAge(entry) {

if (entry.type === 'alias') {
return 5 * 24 * 60 * 60 * 1000;
}


return 5 * 60 * 60 * 1000;
}

function initCache() {
this._lookupCache = {};


this._config.registry.search.forEach(function (registry) {
var cacheDir;
var host = url.parse(registry).host;


if (this._lookupCache[host]) {
return;
}

if (this._config.cache) {
cacheDir = path.join(this._config.cache, encodeURIComponent(host));
mkdirp.sync(cacheDir);
}

this._lookupCache[host] = new Cache(cacheDir);
}, this);
}

function clearCache(name, callback) {
var key;

if (typeof name === 'function') {
callback = name;
name = null;
}

if (name) {
for (key in this._lookupCache) {
this._lookupCache[key].del(name);
}
} else {
for (key in this._lookupCache) {
this._lookupCache[key].clear();
}
}
}

module.exports = lookup;
module.exports.initCache = initCache;
module.exports.clearCache = clearCache;
