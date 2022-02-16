var net = require('net');

var constant = require('./constants');
var helper = require('./helper');

var parseExitCode = function(buffer, defaultCode) {
var tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE) - 1;

if (tailPos < 0) {
return defaultCode;
}


var tail = buffer.slice(tailPos);
var tailStr = tail.toString();
if (tailStr.substr(0, tailStr.length - 1) === constant.EXIT_CODE) {
tail.fill('\x00');
return parseInt(tailStr.substr(-1), 10);
}

return defaultCode;
};


