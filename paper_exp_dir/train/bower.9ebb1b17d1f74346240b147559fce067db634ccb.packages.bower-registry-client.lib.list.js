var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var replay = require('request-replay');
var Cache = require('./util/Cache');
var createError = require('./util/createError');

function list(callback) {
var data = [];
var that = this;
var registry = this._config.registry.search;
var total = registry.length;
var index = 0;



if (!total) {
return callback(null, []);
}


async.doUntil(function (next) {
var remote = url.parse(registry[index]);
var listCache = that._listCache[remote.host];


if (that._config.offline) {
return listCache.get('list', function (err, results) {
if (err || !results) {
return next(err);
}


results.forEach(function (result) {
addResult.call(that, data, result);
});

next();
});
}


doRequest.call(that, index, function (err, results) {
if (err || !results) {
return next(err);
}


results.forEach(function (result) {
addResult(data, result);
});


listCache.set('list', results, getMaxAge(), next);
});
}, function () {

return ++index === total;
}, function (err) {


resetCache();


if (err) {
return callback(err);
}

callback(null, data);
});
}

function addResult(accumulated, result) {
var exists = accumulated.some(function (current) {
return current.name === result.name;
});

if (!exists) {
accumulated.push(result);
}
}

function doRequest(index, callback) {
var req;
var msg;
var requestUrl = this._config.registry.search[index] + '/packages';
var remote = url.parse(requestUrl);
var headers = {};
var that = this;

if (this._config.userAgent) {
headers['User-Agent'] = this._config.userAgent;
}

req = replay(request.get(requestUrl, {
proxy: remote.protocol === 'https:' ? this._config.httpsProxy : this._config.proxy,
ca: this._config.ca.search[index],
headers: headers,
strictSSL: this._config.strictSsl,
timeout: this._config.timeout,
json: true
}, function (err, response, body) {

if (err) {
return callback(createError('Request to ' + requestUrl + ' failed: ' + err.message, err.code));
}


if (response.statusCode < 200 || response.statusCode > 299) {
return callback(createError('Request to ' + requestUrl + ' failed with ' + response.statusCode, 'EINVRES'));
}



if (typeof body !== 'object') {
return callback(createError('Response of request to ' + requestUrl + ' is not a valid json', 'EINVRES'));
}

callback(null, body);
}));

if (this._logger) {
req.on('replay', function (replay) {
msg = 'Request to ' + requestUrl + ' failed with ' + replay.error.code + ', ';
msg += 'retrying in ' + (replay.delay / 1000).toFixed(1) + 's';
that._logger.warn('retry', msg);
});
}
}

function getMaxAge() {

return 5 * 60 * 60 * 1000;
}

function initCache() {
this._listCache = this._cache.list || {};


this._config.registry.search.forEach(function (registry) {
var cacheDir;
var host = url.parse(registry).host;


if (this._listCache[host]) {
return;
}

if (this._config.cache) {
cacheDir = path.join(this._config.cache, encodeURIComponent(host), 'list');
}

this._listCache[host] = new Cache(cacheDir, {
max: 250,

useStale: this._config.offline
});
}, this);
}

function clearCache(callback) {
var listCache = this._listCache;
var remotes = Object.keys(listCache);



async.forEach(remotes, function (remote, next) {
listCache[remote].clear(next);
}, callback);
}

function resetCache() {
var remote;

for (remote in this._listCache) {
this._listCache[remote].reset();
}
}

list.initCache = initCache;
list.clearCache = clearCache;
list.resetCache = resetCache;

module.exports = list;
