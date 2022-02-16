var io = require('socket.io');
var di = require('di');

var cfg = require('./config');
var logger = require('./logger');
var constant = require('./constants');
var watcher = require('./watcher');
var plugin = require('./plugin');

var ws = require('./web-server');
var preprocessor = require('./preprocessor');
var Launcher = require('./launcher').Launcher;
var FileList = require('./file_list').List;
var reporter = require('./reporter');
var helper = require('./helper');
var events = require('./events');
var EventEmitter = events.EventEmitter;
var Executor = require('./executor');
var Browser = require('./browser');
var BrowserCollection = require('./browser_collection');
var EmitterWrapper = require('./emitter_wrapper');
var processWrapper = new EmitterWrapper(process);

var log = logger.create();


var start = function(injector, config, launcher, globalEmitter, preprocess, fileList, webServer,
capturedBrowsers, socketServer, executor, done) {

config.frameworks.forEach(function(framework) {
injector.get('framework:' + framework);
});


var singleRunDoneBrowsers = Object.create(null);



var singleRunBrowsers = new BrowserCollection(new EventEmitter());


var singleRunBrowserNotCaptured = false;

webServer.on('error', function(e) {
if (e.code === 'EADDRINUSE') {
log.warn('Port %d in use', config.port);
config.port++;
webServer.listen(config.port);
} else {
throw e;
}
});

var afterPreprocess = function() {
