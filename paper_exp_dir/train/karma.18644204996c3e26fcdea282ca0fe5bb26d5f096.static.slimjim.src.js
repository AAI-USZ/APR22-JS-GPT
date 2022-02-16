var CONTEXT_URL = '/context.html';



var socket = io.connect(location, {
'reconnection delay': 500,
'reconnection limit': 2000,
'max reconnection attempts': Infinity
});

socket.on('connect', function() {
socket.emit('name', window.navigator.userAgent);
});

var browsersElement = document.getElementById('browsers');
socket.on('info', function(browsers) {
var items = [];
for (var i = 0; i < browsers.length; i++) {
items.push(browsers[i].name + ' is ' + (browsers[i].isReady ? 'idle' : 'executing'));
}
browsersElement.innerHTML = '<li>' + items.join('</li><li>') + '</li>';
});

var statusElement = document.getElementById('status');
var updateStatus = function(status) {
return function(param) {
statusElement.innerHTML = param ? status.replace('$', param) : status;
};
};

socket.on('connect', updateStatus('connected'));
socket.on('disconnect', updateStatus('disconnected'));
socket.on('reconnecting', updateStatus('reconnecting in $ ms...'));
socket.on('reconnect', updateStatus('re-connected'));
socket.on('reconnect_failed', updateStatus('failed to reconnect'));

socket.on('server_disconnect', function() {
socket.socket.disconnect();
socket.socket.reconnect();
});

var Testacular = function(socket, context) {
var config;
var hasError = false;
var store = {};



this.error = function(msg, url, line) {
hasError = true;
socket.emit('error', msg + '\nat ' + url + ':' + line);
this.complete();
return true;
};

this.result = function(result) {
socket.emit('result', result);
};

this.complete = function() {
socket.emit('complete');
context.src = 'about:blank';
};

this.info = function(info) {
socket.emit('info', info);
};


this.loaded = function() {

if (!hasError) this.start(config);


this.start = null;
};

this.store = function(key, value) {
if (typeof value === 'undefined') {
return store[key];
}

if (Object.prototype.toString.apply(value) === '[object Array]') {
var s = store[key] = [];
for (var i = 0; i < value.length; i++) {
s.push(value[i]);
}
} else {

store[key] = value;
}
};



this.start = this.complete;

socket.on('execute', function(cfg) {

hasError = false;
config = cfg;
context.src = CONTEXT_URL;



if (window.console && window.console.clear) {
window.console.clear();
}
});
};
