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



async.doUntil(
function(next) {
var remote = url.parse(registry[index]);
var searchCache = that._searchCache[remote.host];


if (that._config.offline) {
return searchCache.get(name, function(err, results) {
if (err || !results || !results.length) {
return next(err);
}
