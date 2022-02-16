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
json: true
}, function (err, response, body) {

if (err) {
return next(createError('Request to "' + requestUrl + '" failed: ' + err.message, err.code));
}


if (response.statusCode === 404) {
return next();
}


if (response.statusCode < 200 || response.statusCode > 299) {
return next(createError('Request to "' + requestUrl + '" failed with ' + response.statusCode, 'EINVRES'));
}



if (typeof body !== 'object') {
return next(createError('Response of request to "' + requestUrl + '" is not a valid json', 'EINVRES'));
}

url = body.url;
next();
});
}, function () {

return !!url || current++ < total;
}, function (err) {

if (err) {
return callback(err);
