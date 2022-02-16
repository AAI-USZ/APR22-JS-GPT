


var accepts = require('accepts');
var typeis = require('type-is');
var basicAuth = require('basic-auth');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function(name){
switch (name = name.toLowerCase()) {
case 'referer':
