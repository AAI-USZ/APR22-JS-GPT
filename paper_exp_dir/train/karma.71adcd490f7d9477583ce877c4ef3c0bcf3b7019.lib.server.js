var io = require('socket.io'),
net = require('net'),
cfg = require('./config'),
ws = require('./web-server'),
logger = require('./logger'),
util = require('./util');

var STATIC_FOLDER = __dirname + '/../static/';

exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);
