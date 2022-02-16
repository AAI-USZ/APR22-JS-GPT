


require('core-js/modules/es5')
var Karma = require('./karma')
var StatusUpdater = require('./updater')
var util = require('./util')

var KARMA_URL_ROOT = require('./constants').KARMA_URL_ROOT


var socket = io(location.host, {
reconnectionDelay: 500,
reconnectionDelayMax: Infinity,
