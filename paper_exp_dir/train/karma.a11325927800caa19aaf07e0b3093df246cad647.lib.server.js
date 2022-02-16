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

var STATIC_FOLDER = __dirname + '/../static';


exports.start = function(configFilePath, cliOptions) {
var config = cfg.parseConfig(configFilePath, cliOptions);

logger.setLevel(config.logLevel);
logger.useColors(config.colors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var fileGuardian = new cfg.FileGuardian(config.files, config.exclude, globalEmitter, config.autoWatch, config.autoWatchInterval);
var launcher = new Launcher(config.port);

var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

webServer.on('listening', function() {
log.info('Web server started at http://localhost:' + config.port);
});

webServer.on('error', function(e) {
if (e.code === 'EADDRINUSE') {
log.warn('Port %d in use', config.port);
config.port++;
webServer.listen(config.port);
} else throw e;
});

webServer.listen(config.port, function() {
if (config.browsers && config.browsers.length) {
launcher.launch(config.browsers);
}
});

var resultReporter = reporter.createReporter(config.reporter, config.colors);
globalEmitter.bind(resultReporter);

var capturedBrowsers = new browser.Collection(globalEmitter);
var executionScheduled = false;
var pendingCount = 0;
var runningBrowsers;

globalEmitter.on('browsers_change', function() {

socketServer.sockets.emit('info', capturedBrowsers.serialize());
});

globalEmitter.on('browser_register', function(browser) {
if (browser.launchId) {
launcher.markCaptured(browser.launchId);
}

if (config.singleRun && launcher.areAllCaptured()) {
tryExecution();
}
});

var tryExecution = function() {
var nonReady = [];

if (!capturedBrowsers.length) {
