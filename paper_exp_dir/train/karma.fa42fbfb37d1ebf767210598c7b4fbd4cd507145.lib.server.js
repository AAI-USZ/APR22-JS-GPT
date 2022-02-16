var io = require('socket.io');
var net = require('net');
var di = require('di');

var cfg = require('./config');
var logger = require('./logger');
var browser = require('./browser');
var constant = require('./constants');
var watcher = require('./watcher');

var ws = require('./web-server');
var preprocessor = require('./preprocessor');
var Launcher = require('./launcher').Launcher;
var FileList = require('./file-list').List;
var reporter = require('./reporter');
var helper = require('./helper');
var EventEmitter = require('./events').EventEmitter;




var start = function(injector, config, launcher, globalEmitter, preprocess, fileList, webServer,
resultReporter, capturedBrowsers, done) {

logger.setup(config.logLevel, config.colors, config.loggers);

var log = logger.create();
var filesPromise = fileList.refresh();

if (config.autoWatch) {
filesPromise.then(function() {
injector.invoke(watcher.watch);
});
}


var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', constant.LOG_ERROR),
