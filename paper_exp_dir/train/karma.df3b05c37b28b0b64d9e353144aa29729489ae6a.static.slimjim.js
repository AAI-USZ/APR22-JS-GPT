var CONTEXT_URL = '/context.html';


var socket = io.connect();

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
socket.on('temp-disconnect', updateStatus('disconnected'));
socket.on('reconnecting', updateStatus('reconnecting in $ ms...'));
socket.on('reconnect', updateStatus('re-connected'));
socket.on('reconnect_failed', updateStatus('failed to reconnect'));


var SlimJim = function(socket, context) {
var config;
var hasError = false;



this.error = function(msg, url, line) {
hasError = true;
socket.emit('error', msg + '\nat ' + url + ':' + line);
socket.emit('complete');
return true;
};

this.result = function(result) {
socket.emit('result', result);
};

this.complete = function() {
socket.emit('complete');
};

this.info = function(info) {
socket.emit('info', info);
};


this.loaded = function() {

if (!hasError) this.start(config);
};



this.start = this.complete;

socket.on('execute', function(cfg) {

hasError = false;
config = cfg;
context.src = CONTEXT_URL;
});
};

var slimjim = new SlimJim(socket, document.getElementById('context'));
