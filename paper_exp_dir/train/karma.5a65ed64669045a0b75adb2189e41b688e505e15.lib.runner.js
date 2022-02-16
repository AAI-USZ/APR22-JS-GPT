var net = require('net');
var PORT = 1337;

exports.run = function(config) {
var socket = net.connect(config.runnerPort || PORT, function() {
socket.write('run');
socket.pipe(process.stdout);
});
};
