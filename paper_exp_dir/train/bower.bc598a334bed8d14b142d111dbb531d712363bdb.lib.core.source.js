







var request  = require('request');
var config   = require('./config');

var endpoint = config.endpoint + '/packages';

if (process.env.HTTP_PROXY) {
request = request.defaults({'proxy': process.env.HTTP_PROXY});
}

exports.lookup = function (name, callback) {
request.get(endpoint + '/' + encodeURIComponent(name), function (err, response, body) {
