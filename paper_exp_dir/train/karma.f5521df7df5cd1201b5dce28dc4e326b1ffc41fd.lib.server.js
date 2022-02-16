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
var plugin = require('./plugin')

var ws = require('./web-server')
var preprocessor = require('./preprocessor')
var Launcher = require('./launcher').Launcher
var FileList = require('./file-list')
var reporter = require('./reporter')
var helper = require('./helper')
var events = require('./events')
var EventEmitter = events.EventEmitter
var Executor = require('./executor')
var Browser = require('./browser')
var BrowserCollection = require('./browser_collection')
var EmitterWrapper = require('./emitter_wrapper')
var processWrapper = new EmitterWrapper(process)

const karmaJsPath = path.join(__dirname, '/../static/karma.js')
const contextJsPath = path.join(__dirname, '/../static/context.js')


var browserify = null;


function bundleResource (inPath, outPath) {
return new Promise((resolve, reject) => {
browserify = browserify || require('browserify')
