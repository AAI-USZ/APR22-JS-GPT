







var request  = require('request');
var _        = require('underscore');
var config   = require('./config');

var endpoint = config.endpoint + '/packages';



var endpoints = [];
endpoints.push(endpoint);
if (config.searchpath) {
