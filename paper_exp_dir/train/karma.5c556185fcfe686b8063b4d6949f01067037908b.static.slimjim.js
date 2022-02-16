var CONTEXT_URL = '/context.html';


var socket = io.connect();

socket.on('connect', function() {
socket.emit('name', window.navigator.userAgent);
});

var browsersElement = document.getElementById('browsers');
socket.on('info', function(browsers) {
var items = [];
for (var i = 0; i < browsers.length; i++) {
items.push(browsers[i].name + ' is ' + (browsers[i].isReady ? 'iddle' : 'executing'));
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
