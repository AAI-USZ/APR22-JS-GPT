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
var bannerElement = document.getElementById('banner');
var updateStatus = function(status) {
return function(param) {
titleElement.innerHTML = 'Testacular - ' + (param ? status.replace('$', param) : status);
bannerElement.className = status === 'connected' ? 'online' : 'offline';
};
};

socket.on('connect', updateStatus('connected'));
socket.on('disconnect', updateStatus('disconnected'));
socket.on('reconnecting', updateStatus('reconnecting in $ ms...'));
