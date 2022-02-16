var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var replay = require('request-replay');
var Cache = require('./util/Cache');
var createError = require('./util/createError');








function search(name, callback) {
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
var searchCache = that._searchCache[remote.host];


if (that._config.offline) {
return searchCache.get(name, function (err, results) {
if (err || !results || !results.length) {
return next(err);
}


results.forEach(function (result) {
addResult.call(that, data, result);
});

next();
});
}


doRequest.call(that, name, index, function (err, results) {
if (err || !results || !results.length) {
return next(err);
}


results.forEach(function (result) {
addResult.call(that, data, result);
});


searchCache.set(name, results, getMaxAge(), next);
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

function doRequest(name, index, callback) {
var req;
var msg;
var requestUrl = this._config.registry.search[index] + '/packages/search/' + encodeURIComponent(name);
var remote = url.parse(requestUrl);
var headers = {};
var that = this;

if (this._config.userAgent) {
headers['User-Agent'] = this._config.userAgent;
}

req = replay(request.get(requestUrl, {
headers: headers,
ca: this._config.ca.search[index],
strictSSL: this._config.strictSsl,
timeout: this._config.timeout,
json: true
}, function (err, response, body) {

if (err) {
return callback(createError('Request to ' + requestUrl + ' failed: ' + err.message, err.code));
}
