var SocketIO = require('socket.io')
var di = require('di')
var util = require('util')
var Promise = require('bluebird')

var root = global || window || this

var cfg = require('./config')
var logger = require('./logger')
var constant = require('./constants')
var watcher = require('./watcher')
var plugin = require('./plugin')

var ws = require('./web-server')
var preprocessor = require('./preprocessor')
