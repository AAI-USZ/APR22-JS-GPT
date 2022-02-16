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

var EVENTS_TO_REPLY = ['start', 'info', 'error', 'result', 'complete'];
socketServer.sockets.on('connection', function (socket) {
log.debug('A browser has connected on socket ' + socket.id);

var replySocketEvents = events.bufferEvents(socket, EVENTS_TO_REPLY);

socket.on('register', function(info) {
var newBrowser;

if (info.id) {
newBrowser = capturedBrowsers.getById(info.id);
}

if (newBrowser) {
newBrowser.reconnect(socket);
} else {
newBrowser = injector.createChild([{
id: ['value', info.id || null],
fullName: ['value', info.name],
socket: ['value', socket]
}]).instantiate(browser.Browser);

newBrowser.init();


if (config.singleRun) {
newBrowser.execute(config.client);
singleRunBrowsers.add(newBrowser);
}
}

replySocketEvents();
});
});

var emitRunCompleteIfAllBrowsersDone = function() {

var isDone = Object.keys(singleRunDoneBrowsers).reduce(function(isDone, id) {
return isDone && singleRunDoneBrowsers[id];
}, true);

if (isDone) {
var results = singleRunBrowsers.getResults();
if (singleRunBrowserNotCaptured) {
results.exitCode = 1;
}

globalEmitter.emit('run_complete', singleRunBrowsers, results);
}
};

if (config.singleRun) {
globalEmitter.on('browser_complete', function(completedBrowser) {
if (completedBrowser.lastResult.disconnected && completedBrowser.disconnectsCount <= config.browserDisconnectTolerance) {
log.info('Restarting %s (%d of %d attempts)', completedBrowser.name, completedBrowser.disconnectsCount, config.browserDisconnectTolerance);
if (!launcher.restart(completedBrowser.id)) {
singleRunDoneBrowsers[completedBrowser.id] = true;
emitRunCompleteIfAllBrowsersDone();
}
} else {
singleRunDoneBrowsers[completedBrowser.id] = true;

if (launcher.kill(completedBrowser.id)) {

completedBrowser.state = browser.Browser.STATE_DISCONNECTED;
}

emitRunCompleteIfAllBrowsersDone();
}
});

globalEmitter.on('browser_process_failure', function(browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = true;
singleRunBrowserNotCaptured = true;

emitRunCompleteIfAllBrowsersDone();
});

globalEmitter.on('run_complete', function(browsers, results) {
disconnectBrowsers(results.exitCode);
});

globalEmitter.emit('run_start', singleRunBrowsers);
}


if (config.autoWatch) {
globalEmitter.on('file_list_modified', function() {
log.debug('List of files has changed, trying to execute');
executor.schedule();
});
}

var disconnectBrowsers = function(code) {



var sockets = socketServer.sockets.sockets;
Object.getOwnPropertyNames(sockets).forEach(function(key) {
sockets[key].removeAllListeners('disconnect');
});

globalEmitter.emitAsync('exit').then(function() {
done(code || 0);
});
};


try {
process.on('SIGINT', disconnectBrowsers);
process.on('SIGTERM', disconnectBrowsers);
} catch (e) {


}



process.on('uncaughtException', function(error) {
log.error(error);
disconnectBrowsers(1);
});
};
start.$inject = ['injector', 'config', 'launcher', 'emitter', 'preprocess', 'fileList',
'webServer', 'capturedBrowsers', 'socketServer', 'executor', 'done'];


var createSocketIoServer = function(webServer, executor, config) {
var server = io.listen(webServer, {

'destroy upgrade': false,
logger: logger.create('socket.io', constant.LOG_ERROR),
resource: config.urlRoot + 'socket.io',
transports: config.transports
});


executor.socketIoSockets = server.sockets;

return server;
};


exports.start = function(cliOptions, done) {

logger.setup(cliOptions.logLevel || constant.LOG_INFO,
helper.isDefined(cliOptions.colors) ? cliOptions.colors : true, [constant.CONSOLE_APPENDER]);

var config = cfg.parseConfig(cliOptions.configFile, cliOptions);
var modules = [{
helper: ['value', helper],
logger: ['value', logger],
done: ['value', done || process.exit],
emitter: ['type', EventEmitter],
launcher: ['type', Launcher],
config: ['value', config],
preprocess: ['factory', preprocessor.createPreprocessor],
fileList: ['type', FileList],
webServer: ['factory', ws.create],
socketServer: ['factory', createSocketIoServer],
executor: ['type', Executor],

customFileHandlers: ['value', []],

customScriptTypes: ['value', []],
reporter: ['factory', reporter.createReporters],
capturedBrowsers: ['type', browser.Collection],
args: ['value', {}],
timer: ['value', {setTimeout: setTimeout, clearTimeout: clearTimeout}]
}];


modules = modules.concat(plugin.resolve(config.plugins));

var injector = new di.Injector(modules);

injector.invoke(start);
};
