

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, stylus = require('stylus');

var app = express.createServer();








function compile(str, path, fn) {
stylus(str)
.set('filename', path)
.set('compress', true)
.render(fn);
