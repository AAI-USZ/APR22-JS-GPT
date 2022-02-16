var CONTEXT_URL = 'context.html';
var VERSION = '%TESTACULAR_VERSION%';



var testacularSrcPrefix = '%TESTACULAR_SRC_PREFIX%';
var socket = io.connect('http://' + location.host, {
'reconnection delay': 500,
'reconnection limit': 2000,
'resource': testacularSrcPrefix + 'socket.io',
'max reconnection attempts': Infinity
});

