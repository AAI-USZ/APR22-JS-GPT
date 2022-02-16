

'use strict';



var accepts = require('accepts');
var deprecate = require('depd')('express');
var isIP = require('net').isIP;
var typeis = require('type-is');
var http = require('http');
var fresh = require('fresh');
var parseRange = require('range-parser');
var parse = require('parseurl');
var proxyaddr = require('proxy-addr');



var req = Object.create(http.IncomingMessage.prototype)



module.exports = req



req.get =
req.header = function header(name) {
if (!name) {
throw new TypeError('name argument is required to req.get');
