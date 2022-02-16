var net = require('net');
var PORT = 1337;

exports.run = function(config) {
var socket = net.connect(config.runnerPort || PORT);


socket.on('connect', function() {
socket.pipe(process.stdout);
});

socket.on('error', function(e) {
if (e.code === 'ECONNREFUSED') {
console.error('There is no server listening on port %d', config.runnerPort || PORT);
process.exit(1);
} else {
throw e;
}
