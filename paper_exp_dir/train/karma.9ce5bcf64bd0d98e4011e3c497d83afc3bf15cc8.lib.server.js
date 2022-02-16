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


exports.start = function(configFilePath) {
var config = cfg.parseConfig(configFilePath);

logger.setLevel(config.logLevel);
logger.useColors(config.logColors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var fileGuardian = new cfg.FileGuardian(config.files, config.exclude, globalEmitter, config.autoWatch, config.autoWatchInterval);

log.info('Starting web server at http://localhost:' + config.port);
var webServer = ws.createWebServer(fileGuardian, STATIC_FOLDER).listen(config.port);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

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
return false;
} else if (capturedBrowsers.areAllReady(nonReady)) {
log.debug('All browsers are ready, executing');
executionScheduled = false;
capturedBrowsers.setAllIsReadyTo(false);
capturedBrowsers.clearResults();
pendingCount = capturedBrowsers.length;
globalEmitter.emit('run_start', capturedBrowsers);
socketServer.sockets.emit('execute', {});
return true;
} else {
log.info('Delaying execution, these browsers are not ready: ' + nonReady.join(', '));
executionScheduled = true;
return false;
}
};

globalEmitter.on('browser_complete', function(browser) {
pendingCount--;

if (!pendingCount) {
globalEmitter.emit('run_complete', capturedBrowsers);
}
});

globalEmitter.on('run_complete', function() {
if (executionScheduled) tryExecution();
});

socketServer.sockets.on('connection', function (socket) {
log.debug('New browser has connected on socket ' + socket.id);
browser.createBrowser(socket, capturedBrowsers, globalEmitter);
});

globalEmitter.on('file_modified', function() {
log.debug('Execution (fired by autoWatch)');
tryExecution();
});



net.createServer(function (socket) {
socket.on('data', function(buffer) {
log.debug('Execution (fired by runner)');

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://localhost:' + config.port);
socket.end('No captured browser, open http://localhost:' + config.port + '\n');
return;
}


fileGuardian.checkModifications();

globalEmitter.once('run_start', function() {
var socketWrite = socket.write.bind(socket);

