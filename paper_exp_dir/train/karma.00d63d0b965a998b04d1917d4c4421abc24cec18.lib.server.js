var io = require('socket.io');
var net = require('net');
var di = require('di');

var cfg = require('./config');
var logger = require('./logger');
var browser = require('./browser');
var constant = require('./constants');
var watcher = require('./watcher');
var plugin = require('./plugin');

var ws = require('./web-server');
var preprocessor = require('./preprocessor');
var Launcher = require('./launcher').Launcher;
var FileList = require('./file-list').List;
var reporter = require('./reporter');
var helper = require('./helper');
var EventEmitter = require('./events').EventEmitter;

var log = logger.create();



var start = function(injector, config, launcher, globalEmitter, preprocess, fileList, webServer,
resultReporter, capturedBrowsers, done) {

config.frameworks.forEach(function(framework) {
injector.get('framework:' + framework);
});

var filesPromise = fileList.refresh();

if (config.autoWatch) {
filesPromise.then(function() {
injector.invoke(watcher.watch);
});
}


var socketServer = io.listen(webServer, {
logger: logger.create('socket.io', constant.LOG_ERROR),
resource: config.urlRoot + 'socket.io',
transports: config.transports
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
log.info('Karma v%s server started at http://%s:%s%s', constant.VERSION, config.hostname,
config.port, config.urlRoot);

if (config.browsers && config.browsers.length) {
injector.invoke(launcher.launch, launcher);
}
});

var executionScheduled = false;
var pendingCount = 0;
var runningBrowsers;
var clientConfig = {args: config.clientArgs};

globalEmitter.on('browsers_change', function() {

socketServer.sockets.emit('info', capturedBrowsers.serialize());
});

globalEmitter.on('browser_register', function(browser) {
if (browser.launchId) {
launcher.markCaptured(browser.launchId);
