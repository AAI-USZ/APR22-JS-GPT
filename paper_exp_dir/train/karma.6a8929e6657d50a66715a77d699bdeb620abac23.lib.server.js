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
var Launcher = require('./launcher').Launcher;
var FileList = require('./file-list').List;
var watcher = require('./watcher');



exports.start = function(configFilePath, cliOptions) {
var config = cfg.parseConfig(configFilePath, cliOptions);


logger.setLevel(config.logLevel);
logger.useColors(config.colors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var launcher = new Launcher();

var fileList = new FileList(config.files, config.exclude, globalEmitter);

fileList.refresh(function() {
watcher.watch(config.files, fileList);
});

var webServer = ws.createWebServer(fileList, config.basePath, config.proxies);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

webServer.on('error', function(e) {
