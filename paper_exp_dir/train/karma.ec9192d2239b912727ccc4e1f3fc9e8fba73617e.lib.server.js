var io = require('socket.io'),
net = require('net'),
cfg = require('./config'),
ws = require('./web-server'),
logger = require('./logger');

var STATIC_FOLDER = __dirname + '/../static/';

exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

var fileGuardian = new cfg.FileGuardian(config.files);
var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER).listen(config.port);
