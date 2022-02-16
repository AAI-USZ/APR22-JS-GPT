

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



var req = exports = module.exports = {
__proto__: http.IncomingMessage.prototype
};



req.get =
req.header = function header(name) {
var lc = name.toLowerCase();

switch (lc) {
case 'referer':
case 'referrer':
return this.headers.referrer
|| this.headers.referer;
default:
return this.headers[lc];
