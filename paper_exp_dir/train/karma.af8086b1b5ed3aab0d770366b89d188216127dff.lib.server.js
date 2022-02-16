var io = require('socket.io');
var net = require('net');

var cfg = require('./config');
var ws = require('./web-server');
var logger = require('./logger');
var browser = require('./browser');
var reporter = require('./reporter');
var events = require('./events');
var constant = require('./constants');
var watcher = require('./watcher');
var preprocessor = require('./preprocessor');
var Launcher = require('./launcher').Launcher;
var FileList = require('./file-list').List;



exports.start = function(cliOptions, done) {
var config = cfg.parseConfig(cliOptions.configFile, cliOptions);


logger.setLevel(config.logLevel);
logger.useColors(config.colors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var launcher = new Launcher(globalEmitter);

var preprocess = preprocessor.createPreprocessor(config.preprocessors, config.basePath);
var fileList = new FileList(config.files, config.exclude, globalEmitter, preprocess, 250);

var filesPromise = fileList.refresh();

if (config.autoWatch) {
filesPromise.then(function() {
watcher.watch(config.files, fileList);
});
}

var webServer = ws.createWebServer(config.basePath, config.proxies, config.urlRoot);
