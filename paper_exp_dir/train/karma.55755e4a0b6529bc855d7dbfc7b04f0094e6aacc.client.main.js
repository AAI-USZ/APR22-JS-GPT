


require('core-js/es5')
var Karma = require('./karma')
var StatusUpdater = require('./updater')
var util = require('../common/util')
var constants = require('./constants')

var KARMA_URL_ROOT = constants.KARMA_URL_ROOT
var KARMA_PROXY_PATH = constants.KARMA_PROXY_PATH


var socket = io(location.host, {
reconnectionDelay: 500,
reconnectionDelayMax: Infinity,
timeout: 2000,
