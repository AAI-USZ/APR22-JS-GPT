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


var Karma = function(socket, context, navigator, location) {
var config;
var hasError = false;
var store = {};

this.VERSION = VERSION;

this.setupContext = function(contextWindow) {

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
