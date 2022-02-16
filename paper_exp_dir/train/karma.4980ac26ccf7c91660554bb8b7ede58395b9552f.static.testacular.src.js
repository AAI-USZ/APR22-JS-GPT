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
socket.on('disconnect', function() {
browsersElement.innerHTML = '';
});

var statusElement = document.getElementById('status');
var updateStatus = function(status) {
return function(param) {
statusElement.innerHTML = param ? status.replace('$', param) : status;
};
};
