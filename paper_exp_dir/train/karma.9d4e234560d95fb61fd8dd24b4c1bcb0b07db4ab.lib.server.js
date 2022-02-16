var SocketIO = require('socket.io')
var di = require('di')
var util = require('util')
var Promise = require('bluebird')
var spawn = require('child_process').spawn
var tmp = require('tmp')
var fs = require('fs')
var path = require('path')
var root = global || window || this

var cfg = require('./config')
var logger = require('./logger')
var constant = require('./constants')
var watcher = require('./watcher')
