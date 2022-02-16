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

config.frameworks.forEach(function(framework) {
injector.get('framework:' + framework);
});

var log = logger.create();
var filesPromise = fileList.refresh();

if (config.autoWatch) {
filesPromise.then(function() {
injector.invoke(watcher.watch);
});
}


var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', constant.LOG_ERROR),
resource: config.urlRoot + 'socket.io',
transports: ['websocket', 'flashsocket', 'xhr-polling', 'jsonp-polling']
});

webServer.updateFilesPromise(filesPromise);

webServer.on('error', function(e) {
if (e.code === 'EADDRINUSE') {
log.warn('Port %d in use', config.port);
config.port++;
webServer.listen(config.port);
} else {
throw e;
}
});

webServer.listen(config.port, function() {
log.info('Testacular server started at http://%s:%s%s', config.hostname, config.port,
config.urlRoot);

if (config.browsers && config.browsers.length) {
injector.invoke(launcher.launch, launcher);
}
});

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



if ((config.autoWatch || config.singleRun) && launcher.areAllCaptured()) {
tryExecution();
}
});

var tryExecution = function() {
var nonReady = [];

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://%s:%s%s', config.hostname, config.port,
config.urlRoot);
return false;
} else if (capturedBrowsers.areAllReady(nonReady)) {
log.debug('All browsers are ready, executing');
executionScheduled = false;
capturedBrowsers.setAllIsReadyTo(false);
capturedBrowsers.clearResults();
pendingCount = capturedBrowsers.length;
runningBrowsers = capturedBrowsers.clone();
globalEmitter.emit('run_start', runningBrowsers);
socketServer.sockets.emit('execute', {});
return true;
} else {
log.info('Delaying execution, these browsers are not ready: ' + nonReady.join(', '));
executionScheduled = true;
return false;
}
};

globalEmitter.on('browser_complete', function() {
pendingCount--;

if (!pendingCount) {
globalEmitter.emit('run_complete', runningBrowsers, runningBrowsers.getResults());
}
});

globalEmitter.on('run_complete', function(browsers, results) {
if (config.singleRun) {
disconnectBrowsers(results.exitCode);
} else if (executionScheduled) {
tryExecution();
}
});

socketServer.sockets.on('connection', function (socket) {
log.debug('New browser has connected on socket ' + socket.id);
browser.createBrowser(socket, capturedBrowsers, globalEmitter);
});

globalEmitter.on('file_list_modified', function(filesPromise) {
webServer.updateFilesPromise(filesPromise);
tryExecution();
});



var runnerServer = net.createServer(function (socket) {
log.debug('Execution (fired by runner)');

if (!capturedBrowsers.length) {
var url = 'http://' + config.hostname + ':' + config.port + config.urlRoot;

log.warn('No captured browser, open ' + url);
socket.end('No captured browser, open ' + url + '\n');
return;
}

