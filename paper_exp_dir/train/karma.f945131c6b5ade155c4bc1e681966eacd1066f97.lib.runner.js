var net = require('net');

var constant = require('./constants');
var helper = require('./helper');

var parseExitCode = function(buffer, defaultCode) {
var tailPos = buffer.length - Buffer.byteLength(constant.EXIT_CODE_0);

if (tailPos < 0) {
return defaultCode;
}


var tail = buffer.slice(tailPos);
if (tail.toString() === constant.EXIT_CODE_0) {
tail.fill('\x00');
return 0;
}

return defaultCode;
};


exports.run = function(config, done) {
var port = config.runnerPort || constant.DEFAULT_RUNNER_PORT;
var socket = net.connect(port);
var exitCode = 1;


if (! helper.isFunction(done)) {
done = process.exit;
}


socket.on('data', function(buffer) {
exitCode = parseExitCode(buffer, exitCode);
process.stdout.write(buffer);
});

