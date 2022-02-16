







var request  = require('request');
var config   = require('./config');

var endpoint = config.endpoint + '/packages';

if (process.env.HTTP_PROXY) {
request = request.defaults({proxy: process.env.HTTP_PROXY, timeout: 5000 });
}



var endpoints = [];
endpoints.push(endpoint);
if (config.searchpath) {
for (var i = 0; i < config.searchpath.length; i += 1) {
endpoints.push(config.searchpath[i] + '/packages');
}
}

exports.lookup = function (name, callback) {

var f = function (i) {
var endpoint = endpoints[i];
request.get(endpoint + '/' + encodeURIComponent(name), function (err, response, body) {
if (err && response.statusCode !== 200 && response.statusCode !== 404) {
return callback(err || new Error(name + ' failed to look up for endpoint: ' + endpoint));
}

if (response && response.statusCode !== 404) {
