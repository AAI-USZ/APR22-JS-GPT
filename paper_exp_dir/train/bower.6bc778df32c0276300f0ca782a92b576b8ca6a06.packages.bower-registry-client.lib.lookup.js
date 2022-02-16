var path = require('path');
var url = require('url');
var async = require('async');
var request = require('request');
var replay = require('request-replay');
var createError = require('./util/createError');
var Cache = require('./util/Cache');

function lookup(name, callback) {
var data;
var that = this;
var registry = this._config.registry.search;
var total = registry.length;
var index = 0;


if (!total) {
return callback();
}



async.doUntil(
function(next) {
var remote = url.parse(registry[index]);
var lookupCache = that._lookupCache[remote.host];


if (!that._config.force) {
lookupCache.get(name, function(err, value) {
data = value;



if (err || data || that._config.offline) {
