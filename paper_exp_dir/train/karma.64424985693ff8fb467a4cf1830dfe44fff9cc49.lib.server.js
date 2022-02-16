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



exports.start = function(cliOptions) {
var config = cfg.parseConfig(cliOptions.configFile, cliOptions);


logger.setLevel(config.logLevel);
logger.useColors(config.colors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var launcher = new Launcher();

var fileList = new FileList(config.files, config.exclude, globalEmitter);

fileList.refresh(function() {
if (config.autoWatch) {
watcher.watch(config.files, fileList);
}
});

var webServer = ws.createWebServer(fileList, config.basePath);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
transports: ['websocket', 'xhr-polling', 'jsonp-polling']
});

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
log.info('Web server started at http://localhost:' + config.port);

if (config.browsers && config.browsers.length) {
launcher.launch(config.browsers, config.port);
}
});

var resultReporter = reporter.createReporter(config.reporter, config.colors, config.basePath);
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
log.warn('No captured browser, open http://localhost:' + config.port);
return false;
} else if (capturedBrowsers.areAllReady(nonReady)) {
log.debug('All browsers are ready, executing');
executionScheduled = false;
capturedBrowsers.setAllIsReadyTo(false);
capturedBrowsers.clearResults();
pendingCount = capturedBrowsers.length;
runningBrowsers = capturedBrowsers.toArray();
globalEmitter.emit('run_start', runningBrowsers);
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

globalEmitter.emit('run_complete', runningBrowsers, capturedBrowsers.getResults());
}
});

globalEmitter.on('run_complete', function(browsers) {
if (config.singleRun) {




var code = browsers.reduce(function(code, browser) {
var lastResults = browser.lastResult;
return (lastResults.failed || lastResults.disconnected || lastResults.error) ? 1 : code;
}, 0);

disconnectBrowsers(code);
} else if (executionScheduled) {
tryExecution();
}
});

socketServer.sockets.on('connection', function (socket) {
log.debug('New browser has connected on socket ' + socket.id);
browser.createBrowser(socket, capturedBrowsers, globalEmitter);
});

globalEmitter.on('file_list_modified', function() {
log.debug('Execution (fired by autoWatch)');
tryExecution();
});



var runnerServer = net.createServer(function (socket) {
log.debug('Execution (fired by runner)');

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://localhost:' + config.port);
socket.end('No captured browser, open http://localhost:' + config.port + '\n');
return;
}


log.debug('Refreshing all the files / patterns');
fileList.refresh(function() {
if (!tryExecution()) {
socket.write('Waiting for previous execution...\n');
}
});

globalEmitter.once('run_start', function() {
var socketWrite = socket.write.bind(socket);

