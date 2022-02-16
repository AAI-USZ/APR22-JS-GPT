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
