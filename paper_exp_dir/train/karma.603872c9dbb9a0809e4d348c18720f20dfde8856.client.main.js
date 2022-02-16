var Karma = require('./karma');
var StatusUpdater = require('./updater');
var util = require('./util');

var KARMA_URL_ROOT = require('./constants').KARMA_URL_ROOT;



var socket = io('http://' + location.host, {
reconnectionDelay: 500,
reconnectionDelayMax: Infinity,
timeout: 2000,
path: '/' + KARMA_URL_ROOT.substr(1) + 'socket.io',
'sync disconnect on unload': true
});


new StatusUpdater(socket, util.elm('title'), util.elm('banner'), util.elm('browsers'));
window.karma = new Karma(socket, util.elm('context'), window.open,
