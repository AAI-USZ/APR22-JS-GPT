var stringify = require('./stringify');
var constant = require('./constants');
var util = require('./util');



var Karma = function(socket, iframe, opener, navigator, location) {
var hasError = false;
var startEmitted = false;
var reloadingContext = false;
var store = {};
var self = this;
var queryParams = util.parseQueryParams(location.search);
var browserId = queryParams.id || util.generateId('manual-');
var returnUrl = queryParams.return_url || null;
var currentTransport;

var resultsBufferLimit = 1;
var resultsBuffer = [];

this.VERSION = constant.VERSION;
this.config = {};

var childWindow = null;
var navigateContextTo = function(url) {
if (self.config.useIframe === false) {
if (childWindow === null || childWindow.closed === true) {

childWindow = opener('about:blank');
}
childWindow.location = url;
} else {
iframe.src = url;
}
};

this.setupContext = function(contextWindow) {
if (hasError) {
return;
}

var getConsole = function(currentWindow) {
return currentWindow.console || {
log: function() {},
info: function() {},
warn: function() {},
error: function() {},
debug: function() {}
};
};

contextWindow.__karma__ = this;


contextWindow.onerror = function() {
return contextWindow.__karma__.error.apply(contextWindow.__karma__, arguments);
};

contextWindow.onbeforeunload = function(e, b) {
if (!reloadingContext) {

contextWindow.__karma__.error('Some of your tests did a full page reload!');
}
};

if (self.config.captureConsole) {

var localConsole = contextWindow.console = getConsole(contextWindow);
var browserConsoleLog = localConsole.log;
var logMethods = ['log', 'info', 'warn', 'error', 'debug'];
var patchConsoleMethod = function(method) {
var orig = localConsole[method];
if (!orig) {
return;
}
