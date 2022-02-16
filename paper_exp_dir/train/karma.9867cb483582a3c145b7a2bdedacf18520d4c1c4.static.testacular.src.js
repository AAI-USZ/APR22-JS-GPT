var CONTEXT_URL = 'context.html';



var testacularSrcPrefix = '%TESTACULAR_SRC_PREFIX%';
var socket = io.connect(location.href.substring(0, location.href.length - testacularSrcPrefix.length), {
'reconnection delay': 500,
'reconnection limit': 2000,
'resource': testacularSrcPrefix + 'socket.io',
'max reconnection attempts': Infinity
});

var browsersElement = document.getElementById('browsers');
