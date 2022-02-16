var CONTEXT_URL = '/context.html';



var socket = io.connect(location, {
'reconnection delay': 500,
'reconnection limit': 2000,
'max reconnection attempts': Infinity
});

socket.on('connect', function() {
socket.emit('name', window.navigator.userAgent);
});
