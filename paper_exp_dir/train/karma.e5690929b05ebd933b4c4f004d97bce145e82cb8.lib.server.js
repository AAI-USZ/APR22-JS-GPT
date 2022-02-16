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
log.info('Testacular server started at http://localhost:' + config.port + config.urlRoot);

if (config.browsers && config.browsers.length) {
launcher.launch(config.browsers, config.port, config.urlRoot);
}
});

var resultReporter = reporter.createReporters(config.reporters, config);
resultReporter.reporters.forEach(function(reporter) {
globalEmitter.bind(reporter);
});

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

globalEmitter.on('browser_complete', function(browser) {
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
