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
