var CONTEXT_URL = 'context.html';



var testacularSrcPrefix = '%TESTACULAR_SRC_PREFIX%';
var socket = io.connect('http://' + location.host, {
'reconnection delay': 500,
'reconnection limit': 2000,
'resource': testacularSrcPrefix + 'socket.io',
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
var updateStatus = function(status) {
return function(param) {
titleElement.innerHTML = 'Testacular - ' + (param ? status.replace('$', param) : status);
titleElement.className = status === 'connected' ? 'online' : 'offline';
};
};

socket.on('connect', updateStatus('connected'));
socket.on('disconnect', updateStatus('disconnected'));
socket.on('reconnecting', updateStatus('reconnecting in $ ms...'));
socket.on('reconnect', updateStatus('re-connected'));
socket.on('reconnect_failed', updateStatus('failed to reconnect'));

var Testacular = function(socket, context, navigator, location) {
var config;
var hasError = false;
var store = {};

var clearContext = function() {
context.src = 'about:blank';
};



this.error = function(msg, url, line) {
hasError = true;
socket.emit('error', msg + '\nat ' + url + ':' + line);
this.complete();
return true;
};

this.result = function(result) {
socket.emit('result', result);
};

this.complete = function(result) {
socket.emit('complete', result);
clearContext();
};

this.info = function(info) {
socket.emit('info', info);
};


this.loaded = function() {

if (!hasError) {
this.start(config);
}


this.start = null;
};

this.store = function(key, value) {
if (typeof value === 'undefined') {
