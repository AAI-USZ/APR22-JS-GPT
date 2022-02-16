var io = require('socket.io');
var net = require('net');
var cfg = require('./config');
var ws = require('./web-server');
var logger = require('./logger');
var browser = require('./browser');
var reporter = require('./reporter');
var events = require('./events');

var STATIC_FOLDER = __dirname + '/../static';


exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

var log = logger.create();
var fileGuardian = new cfg.FileGuardian(config.files, config.exclude, config.autoWatch, config.autoWatchInterval);

log.info('Starting web server at http://localhost:' + config.port);
var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER).listen(config.port);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

var globalEmitter = new events.EventEmitter();
var resultReporter = new reporter.Progress();
globalEmitter.bind(resultReporter);

var capturedBrowsers = new browser.Collection(globalEmitter);
var executionScheduled = false;
var pendingCount = 0;

globalEmitter.on('browsers_change', function() {

socketServer.sockets.emit('info', capturedBrowsers.serialize());
});

var tryExecution = function() {
var nonReady = [];

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://localhost:' + config.port);
} else if (capturedBrowsers.areAllReady(nonReady)) {
