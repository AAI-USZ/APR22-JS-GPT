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
var preprocessor = require('./preprocessor');



exports.start = function(cliOptions) {
var config = cfg.parseConfig(cliOptions.configFile, cliOptions);


logger.setLevel(config.logLevel);
logger.useColors(config.colors);

var log = logger.create();
var globalEmitter = new events.EventEmitter();
var launcher = new Launcher();

var preprocess = preprocessor.createPreprocessor(config.preprocessors, config.basePath);
var fileList = new FileList(config.files, config.exclude, globalEmitter, preprocess);

fileList.refresh(function() {
if (config.autoWatch) {
watcher.watch(config.files, fileList);
}
});

var webServer = ws.createWebServer(fileList, config.basePath, config.proxies, config.urlRoot);
var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', 0),
resource: config.urlRoot + 'socket.io',
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
log.info('Web server started at http://localhost:' + config.port + config.urlRoot);

if (config.browsers && config.browsers.length) {
launcher.launch(config.browsers, config.port, config.urlRoot);
}
});

var resultReporter = reporter.createReporter(config.reporter, config.colors, config.basePath, config.urlRoot, config.reportSlowerThan);
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

if ((config.autoWatch || config.singleRun) && launcher.areAllCaptured()) {
tryExecution();
}
});

var tryExecution = function() {
var nonReady = [];

if (!capturedBrowsers.length) {
log.warn('No captured browser, open http://localhost:' + config.port + config.urlRoot);
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
log.warn('No captured browser, open http://localhost:' + config.port + config.urlRoot);
socket.end('No captured browser, open http://localhost:' + config.port + config.urlRoot + '\n');
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

resultReporter.adapters.push(socketWrite);


globalEmitter.once('run_complete', function(browsers, results) {




var code = browsers.reduce(function(code, browser) {
var lastResults = browser.lastResult;
return (lastResults.failed || lastResults.disconnected || lastResults.error) ? 1 : code;
}, 0);

util.arrayRemove(resultReporter.adapters, socketWrite);
socket.end(!code && constant.EXIT_CODE_0);
});
});
});

runnerServer.on('error', function(e) {
if (e.code === 'EADDRINUSE') {
log.warn('Port %d in use', config.runnerPort);
config.runnerPort++;
runnerServer.listen(config.runnerPort);
} else {
throw e;
}
});

runnerServer.listen(config.runnerPort);

runnerServer.on('listening', function() {
if (config.runnerPort !== constant.DEFAULT_RUNNER_PORT) {
log.info('To run via this server, use "testacular run --runner-port %d"', config.runnerPort);
}
});

var disconnectBrowsers = function(code) {



var sockets = socketServer.sockets.sockets;
Object.getOwnPropertyNames(sockets).forEach(function(key) {
sockets[key].removeAllListeners('disconnect');
});


log.info('Disconnecting all browsers');
log.debug('Waiting for child processes to finish');
