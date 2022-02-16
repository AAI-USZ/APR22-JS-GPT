var CONTEXT_URL = '/context.html';


var socket = io.connect();

socket.on('connect', function() {
socket.emit('name', window.navigator.userAgent);
});

var browsersElement = document.getElementById('browsers');
socket.on('info', function(info) {
var items = [];
info.forEach(function(browser) {
items.push(browser.name + ' is ' + (browser.isReady ? 'iddle' : 'executing'));
});
browsersElement.innerHTML = '<li>' + items.join('</li><li>') + '</li>';
});

var statusElement = document.getElementById('status');
