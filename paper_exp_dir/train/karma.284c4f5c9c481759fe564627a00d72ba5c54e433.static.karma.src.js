var CONTEXT_URL = 'context.html';
var VERSION = '%KARMA_VERSION%';



var karmaSrcPrefix = '%KARMA_SRC_PREFIX%';
var socket = io.connect('http://' + location.host, {
'reconnection delay': 500,
'reconnection limit': 2000,
'resource': karmaSrcPrefix + 'socket.io',
'max reconnection attempts': Infinity
});

var browsersElement = document.getElementById('browsers');
socket.on('info', function(browsers) {
var items = [], status;
for (var i = 0; i < browsers.length; i++) {
status = browsers[i].isReady ? 'idle' : 'executing';
items.push('<li class="' + status + '">' + browsers[i].name + ' is ' + status + '</li>');
}
browsersElement.innerHTML = items.join('\n');
});
socket.on('disconnect', function() {
browsersElement.innerHTML = '';
});

var titleElement = document.getElementById('title');
var bannerElement = document.getElementById('banner');
var updateStatus = function(status) {
return function(param) {
var paramStatus = param ? status.replace('$', param) : status;
titleElement.innerHTML = 'Karma v' + VERSION + ' - ' + paramStatus;
bannerElement.className = status === 'connected' ? 'online' : 'offline';
};
};

socket.on('connect', updateStatus('connected'));
socket.on('disconnect', updateStatus('disconnected'));
socket.on('reconnecting', updateStatus('reconnecting in $ ms...'));
socket.on('reconnect', updateStatus('re-connected'));
socket.on('reconnect_failed', updateStatus('failed to reconnect'));

var instanceOf = function(value, constructorName) {
return Object.prototype.toString.apply(value) === '[object ' + constructorName + ']';
};


var Karma = function(socket, context, navigator, location) {
var config;
var hasError = false;
var store = {};
var self = this;

this.VERSION = VERSION;

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
if (context.src !== 'about:blank') {

contextWindow.__karma__.error('Some of your tests did a full page reload!');
}
};


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
