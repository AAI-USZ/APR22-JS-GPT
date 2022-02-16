var net = require('net');
var constant = require('./constants');

var parseExitCode = function(buffer, defaultCode) {

var tail = buffer.slice(buffer.length - Buffer.byteLength(constant.EXIT_CODE_0));

if (tail.toString() === constant.EXIT_CODE_0) {
tail.fill('\000');
return 0;
}

return defaultCode;
};

