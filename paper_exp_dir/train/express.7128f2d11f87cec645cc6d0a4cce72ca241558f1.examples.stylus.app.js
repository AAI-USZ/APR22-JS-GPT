


var express = require('../../lib/express')
, stylus = require('stylus');

var app = express.createServer();








function compile(str, path) {
return stylus(str)
.set('filename', path)
.set('compress', true);
