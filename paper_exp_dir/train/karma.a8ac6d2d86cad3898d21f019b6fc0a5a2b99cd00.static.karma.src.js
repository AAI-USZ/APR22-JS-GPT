var CONTEXT_URL = 'context.html';
var VERSION = '%KARMA_VERSION%';
var KARMA_URL_ROOT = '%KARMA_URL_ROOT%';



var socket = io.connect('http://' + location.host, {
'reconnection delay': 500,
'reconnection limit': 2000,
'resource': KARMA_URL_ROOT.substr(1) + 'socket.io',
'sync disconnect on unload': true,
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
var hasError = false;
var store = {};
var self = this;
var browserId = (location.search.match(/\?id=(.*)/) || [])[1] ||
'manual-' + Math.floor(Math.random() * 10000);

var resultsBufferLimit = 1;
var resultsBuffer = [];

this.VERSION = VERSION;
this.config = {};

this.setupContext = function(contextWindow) {
