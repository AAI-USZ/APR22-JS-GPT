var http = require('http');

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



exports.run = function(config, done) {
done = helper.isFunction(done) ? done : process.exit;

var exitCode = 1;
var options = {
hostname: 'localhost',
path: '/__run__',

