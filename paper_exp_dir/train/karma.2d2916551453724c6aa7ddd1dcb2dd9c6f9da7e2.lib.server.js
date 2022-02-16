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

function createSocketIoServer (webServer, executor, config) {
var server = new SocketIO(webServer, {

destroyUpgrade: false,
path: config.urlRoot + 'socket.io/',
transports: config.transports
})


executor.socketIoSockets = server.sockets

return server
}


var Server = function (cliOptions, done) {
EventEmitter.call(this)

logger.setupFromConfig(cliOptions)

this.log = logger.create()

var config = cfg.parseConfig(cliOptions.configFile, cliOptions)

var modules = [{
helper: ['value', helper],
