







var request  = require('request');
var config   = require('./config');

var endpoint = config.endpoint + '/packages';

if (config.proxy) {
request = request.defaults({ proxy: config.proxy, timeout: 5000 });
}



var endpoints = [];
endpoints.push(endpoint);
if (config.searchpath) {
for (var i = 0; i < config.searchpath.length; i += 1) {
endpoints.push(config.searchpath[i] + '/packages');
}
}

exports.lookup = function (name, callback, targetEndpoints) {
if (!targetEndpoints) {
targetEndpoints = endpoints;
}


var f = function (i) {
var endpoint = targetEndpoints[i];
request.get(endpoint + '/' + encodeURIComponent(name), function (err, response, body) {
if (err || (response.statusCode !== 200 && response.statusCode !== 404)) {
