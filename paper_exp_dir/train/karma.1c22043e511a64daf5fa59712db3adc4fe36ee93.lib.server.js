var io = require('socket.io'),
net = require('net'),
cfg = require('./config'),
ws = require('./web-server');

exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);
var fileGuardian = new cfg.FileGuardian(config.files);
var webServer = ws.createWebServer(fileGuardian);
var socketServer = io.listen(webServer);
