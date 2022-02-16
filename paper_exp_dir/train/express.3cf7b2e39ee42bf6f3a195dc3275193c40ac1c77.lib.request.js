


var accepts = require('accepts');
var typeis = require('type-is');
var basicAuth = require('basic-auth');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var utils = require('./utils');
var parse = utils.parseUrl;



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};
