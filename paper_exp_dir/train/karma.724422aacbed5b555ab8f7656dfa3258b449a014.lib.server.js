var io = require('socket.io');
var net = require('net');
var cfg = require('./config');
var ws = require('./web-server');
var logger = require('./logger');
var browser = require('./browser');
var reporter = require('./reporter');
var events = require('./events');
var util = require('./util');

var STATIC_FOLDER = __dirname + '/../static';


exports.start = function(configFilePath, cliOptions) {
var config = cfg.parseConfig(configFilePath, cliOptions);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var fileGuardian = new cfg.FileGuardian(config.files, config.exclude, globalEmitter, config.autoWatch, config.autoWatchInterval);

var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

webServer.on('listening', function() {
log.info('Web server started at http://localhost:' + config.port);
});

webServer.on('error', function(e) {
