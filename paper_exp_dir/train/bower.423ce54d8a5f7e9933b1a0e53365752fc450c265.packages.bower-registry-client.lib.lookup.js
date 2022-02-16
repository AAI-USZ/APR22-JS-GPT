var async = require('async');
var request = require('request');
var parseOptions = require('./util/parseOptions');
var createError = require('./util/createError');

function lookup(name, options, callback) {
var url;
var total;
var current = 0;

if (typeof options === 'function') {
callback = options;
options = {};
}


options = parseOptions.forRead(options);



total = options.registry.length;
if (!total) {
return callback(createError('Package "' + name + '" not found', 'ENOTFOUND'));
}








async.doUntil(function (next) {
var requestUrl = options.registry[current] + '/packages/' + encodeURIComponent(name);

request.get(requestUrl, {
proxy: options.proxy,
timeout: options.timeout,
