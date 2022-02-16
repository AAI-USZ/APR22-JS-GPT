

var accepts = require('accepts');
var deprecate = require('depd')('express');
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');
var proxyaddr = require('proxy-addr');



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
