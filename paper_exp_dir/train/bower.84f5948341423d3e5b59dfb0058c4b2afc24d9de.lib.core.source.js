







var request  = require('request');
var _        = require('underscore');
var config   = require('./config');

var endpoint = config.endpoint + '/packages';


var endpoints = [];
endpoints.push(endpoint);
if (config.searchpath) {
for (var i = 0; i < config.searchpath.length; i++) {
endpoints.push(config.searchpath[i] + '/packages');
}
}


exports.lookup = function (name, callback) {

var f = function(i) {
var endpoint = endpoints[i];
