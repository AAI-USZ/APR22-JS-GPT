var io = require('socket.io');
var net = require('net');
var cfg = require('./config');
var ws = require('./web-server');
var logger = require('./logger');
var browser = require('./browser');
var reporter = require('./reporter');
var events = require('./events');
var util = require('./util');
var constant = require('./constants');

var STATIC_FOLDER = __dirname + '/../static';


exports.start = function(configFilePath, cliOptions) {
var config = cfg.parseConfig(configFilePath, cliOptions);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

