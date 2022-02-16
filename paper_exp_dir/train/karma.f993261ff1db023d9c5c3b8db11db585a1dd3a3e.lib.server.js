var http = require('http'),
io = require('socket.io'),
fs = require('fs'),
net = require('net'),
vm = require('vm'),
path = require('path'),
config = require('./config'),
util = require('util');

var PORTS = [1337, 8080];


var includeFiles = [];



function handler (req, res) {
var STATIC_FOLDER = __dirname + '/../static/';
var file;

if (req.url === '/') {
file = STATIC_FOLDER + 'client.html';
} else if (req.url === '/context.html') {
file = STATIC_FOLDER + 'context.html';

return fs.readFile(file, function(err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading file...');
}

res.writeHead(200);

var SCRIPT = '<script type="text/javascript" src="%s"></script>';
var scriptTags = [];
includeFiles.forEach(function(path) {
scriptTags.push(util.format(SCRIPT, path));
});

return res.end(data.toString().replace('%SCRIPTS%', scriptTags.join('\n')));

});
} else {

file = req.url.replace(/\?.*/, '');
}

fs.readFile(file, function (err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading file...');
}

res.writeHead(200);
return res.end(data);
});
}

exports.start = function(configFilePath) {
var webServer = http.createServer(handler);
var socketServer = io.listen(webServer);

config.getFiles(configFilePath, function(err, files) {
includeFiles = files;
});

socketServer.set('log level', 1);
webServer.listen(PORTS[1]);


socketServer.sockets.on('connection', function (socket) {
var name;
console.log('new browser');
socket.on('result', function (result) {
console.log('RESULT: ', result);
});

socket.on('disconnect', function() {
console.log('browser disconnected ', name);
});

socket.on('name', function(_name) {
name = _name;
