var net = require('net');

var constant = require('./constants');


var parseExitCode = function(buffer, defaultCode) {
var tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE_0);

if (tailPos < 0) {
return defaultCode;
}
