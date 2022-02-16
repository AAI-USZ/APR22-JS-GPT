var io = require('socket.io');
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
var events = require('./events');
var EventEmitter = events.EventEmitter;
var Executor = require('./executor');

var log = logger.create();


var start = function(injector, config, launcher, globalEmitter, preprocess, fileList, webServer,
capturedBrowsers, socketServer, executor, done) {

config.frameworks.forEach(function(framework) {
injector.get('framework:' + framework);
});

var filesPromise = fileList.refresh();

if (config.autoWatch) {
filesPromise.then(function() {
injector.invoke(watcher.watch);
});
}

webServer.on('error', function(e) {
if (e.code === 'EADDRINUSE') {
log.warn('Port %d in use', config.port);
config.port++;
webServer.listen(config.port);
} else {
throw e;
}
});


var singleRunDoneBrowsers = Object.create(null);



var singleRunBrowsers = new browser.Collection(new EventEmitter());


var singleRunBrowserNotCaptured = false;

webServer.listen(config.port, function() {
log.info('Karma v%s server started at http://%s:%s%s', constant.VERSION, config.hostname,
config.port, config.urlRoot);

if (config.browsers && config.browsers.length) {
injector.invoke(launcher.launch, launcher).forEach(function(browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = false;
});
}
});

globalEmitter.on('browsers_change', function() {

socketServer.sockets.emit('info', capturedBrowsers.serialize());
});

globalEmitter.on('browser_register', function(browser) {
launcher.markCaptured(browser.id);



if (config.autoWatch && launcher.areAllCaptured()) {
executor.schedule();
}
});

socketServer.sockets.on('connection', function (socket) {
log.debug('A browser has connected on socket ' + socket.id);

var replySocketEvents = events.bufferEvents(socket, ['info', 'error', 'result', 'complete']);

socket.on('register', function(info) {
var newBrowser;

if (info.id) {
newBrowser = capturedBrowsers.getById(info.id);
}

if (newBrowser) {
newBrowser.onReconnect(socket);
} else {
newBrowser = injector.createChild([{
id: ['value', info.id || null],
fullName: ['value', info.name],
socket: ['value', socket]
}]).instantiate(browser.Browser);

newBrowser.init();
}

replySocketEvents();


if (config.singleRun) {

