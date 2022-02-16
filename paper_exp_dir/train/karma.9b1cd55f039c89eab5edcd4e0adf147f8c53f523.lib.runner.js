var net = require('net');


var PORT = 1337;

exports.run = function() {
var socket = net.connect(PORT, function() {
socket.write('run');
socket.pipe(process.stdout);
});
