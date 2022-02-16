


var accepts = require('accepts');
var typeis = require('type-is');
var http = require('http')
, utils = require('./utils')
, fresh = require('fresh')
, parseRange = require('range-parser')
, parse = utils.parseUrl



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};


