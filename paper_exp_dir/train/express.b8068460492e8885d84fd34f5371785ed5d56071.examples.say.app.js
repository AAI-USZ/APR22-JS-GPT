

require.paths.unshift(__dirname + '/../../support');



var express = require('../../')
, path = require('path')
, exec = require('child_process').exec
, fs = require('fs');



function errorHandler(err, req, res, next) {
var parts = err.stack.split('\n')[1].split(/[()]/)[1].split(':')
, filename = parts.shift()
, basename = path.basename(filename)
, lineno = parts.shift()
, col = parts.shift()
, lines = fs.readFileSync(filename, 'utf8').split('\n')
