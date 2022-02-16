var http = require('http');

var constant = require('./constants');
var helper = require('./helper');
var cfg = require('./config');


var parseExitCode = function(buffer, defaultCode) {
var tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE) - 1;

if (tailPos < 0) {
return defaultCode;
}

