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

doRequest(name, index, that._config, function (err, info) {
if (err) {
return next(err);
}

data = info;


that._lookupCache[remote.host].set(name, info, getMaxAge(info), next);
});
});


} else {
