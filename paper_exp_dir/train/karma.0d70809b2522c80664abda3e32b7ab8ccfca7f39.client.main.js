


var Karma = require('./karma')
var StatusUpdater = require('./updater')
var util = require('../common/util')
var constants = require('./constants')

var KARMA_URL_ROOT = constants.KARMA_URL_ROOT
var KARMA_PROXY_PATH = constants.KARMA_PROXY_PATH
var BROWSER_SOCKET_TIMEOUT = constants.BROWSER_SOCKET_TIMEOUT


var socket = io(location.host, {
