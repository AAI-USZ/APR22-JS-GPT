


var accepts = require('accepts');
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
