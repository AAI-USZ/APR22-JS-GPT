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
var returnUrl = queryParams['return_url' + ''] || null;
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
localConsole[method] = function() {
self.log(method, arguments);
return Function.prototype.apply.call(orig, localConsole, arguments);
};
};
for (var i = 0; i < logMethods.length; i++) {
patchConsoleMethod(logMethods[i]);
}
}

contextWindow.dump = function() {
self.log('dump', arguments);
};

contextWindow.alert = function(msg) {
self.log('alert', [msg]);
};
};

this.log = function(type, args) {
var values = [];

for (var i = 0; i < args.length; i++) {
values.push(this.stringify(args[i], 3));
}

this.info({log: values.join(', '), type: type});
};

this.stringify = stringify;


var clearContext = function() {
reloadingContext = true;
navigateContextTo('about:blank');
};



this.error = function(msg, url, line) {
hasError = true;
socket.emit('error', url ? msg + '\nat ' + url + (line ? ':' + line : '') : msg);
this.complete();
return false;
};

this.result = function(result) {
if (!startEmitted) {
socket.emit('start', {total: null});
startEmitted = true;
}

if (resultsBufferLimit === 1) {
return socket.emit('result', result);
}

resultsBuffer.push(result);

if (resultsBuffer.length === resultsBufferLimit) {
socket.emit('result', resultsBuffer);
resultsBuffer = [];
}
};

this.complete = function(result) {
if (resultsBuffer.length) {
socket.emit('result', resultsBuffer);
resultsBuffer = [];
}



setTimeout(function() {
socket.emit('complete', result || {});
clearContext();




if (returnUrl) {
setTimeout(function() {
location.href = returnUrl;
}, (currentTransport === 'websocket' || currentTransport === 'flashsocket') ? 0 : 3000);
}
}, 0);
};

this.info = function(info) {

if (!startEmitted && util.isDefined(info.total)) {
socket.emit('start', info);
startEmitted = true;
} else {
socket.emit('info', info);
}
};

var UNIMPLEMENTED_START = function() {
this.error('You need to include some adapter that implements __karma__.start method!');
};


this.loaded = function() {

if (!hasError) {
this.start(this.config);
}


this.start = UNIMPLEMENTED_START;
};

this.store = function(key, value) {
if (util.isUndefined(value)) {
return store[key];
}

if (util.instanceOf(value, 'Array')) {
var s = store[key] = [];
for (var i = 0; i < value.length; i++) {
s.push(value[i]);
}
} else {

store[key] = value;
}
};



this.start = UNIMPLEMENTED_START;

socket.on('execute', function(cfg) {

hasError = false;
startEmitted = false;
reloadingContext = false;
self.config = cfg;
navigateContextTo(constant.CONTEXT_URL);



if (window.console && window.console.clear) {
window.console.clear();
}
});


socket.on('connect', function() {
currentTransport = socket.socket.transport.name;


if (currentTransport === 'websocket' || currentTransport === 'flashsocket') {
resultsBufferLimit = 1;
} else {
resultsBufferLimit = 50;
}

socket.emit('register', {
name: navigator.userAgent,
id: browserId
});
});
};

module.exports = Karma;
