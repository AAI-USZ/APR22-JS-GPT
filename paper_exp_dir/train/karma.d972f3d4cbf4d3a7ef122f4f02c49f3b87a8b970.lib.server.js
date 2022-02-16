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

function createSocketIoServer (webServer, executor, config) {
var server = new SocketIO(webServer, {

destroyUpgrade: false,
path: config.urlRoot + 'socket.io/',
transports: config.transports,
forceJSONP: config.forceJSONP
})


executor.socketIoSockets = server.sockets

return server
}


var Server = function (cliOptions, done) {
EventEmitter.call(this)

logger.setupFromConfig(cliOptions)

this.log = logger.create()

this.loadErrors = []

var config = cfg.parseConfig(cliOptions.configFile, cliOptions)

var modules = [{
helper: ['value', helper],
logger: ['value', logger],
done: ['value', done || process.exit],
emitter: ['value', this],
server: ['value', this],
launcher: ['type', Launcher],
config: ['value', config],
preprocess: ['factory', preprocessor.createPreprocessor],
fileList: ['type', FileList],
webServer: ['factory', ws.create],
socketServer: ['factory', createSocketIoServer],
executor: ['type', Executor],

customFileHandlers: ['value', []],

customScriptTypes: ['value', []],
reporter: ['factory', reporter.createReporters],
capturedBrowsers: ['type', BrowserCollection],
args: ['value', {}],
timer: ['value', {
setTimeout: function () {
return setTimeout.apply(root, arguments)
},
clearTimeout: function (timeoutId) {
clearTimeout(timeoutId)
}
}]
}]

this._setUpLoadErrorListener()

modules = modules.concat(plugin.resolve(config.plugins, this))

this._injector = new di.Injector(modules)
}


util.inherits(Server, EventEmitter)





Server.prototype.start = function () {
this._injector.invoke(this._start, this)
}


Server.start = function (cliOptions, done) {
var server = new Server(cliOptions, done)
server.start()
}




Server.prototype.get = function (token) {
return this._injector.get(token)
}


Server.prototype.refreshFiles = function () {
if (!this._fileList) return Promise.resolve()

return this._fileList.refresh()
}




Server.prototype._start = function (config, launcher, preprocess, fileList,
capturedBrowsers, executor, done) {
var self = this
if (config.detached) {
this._detach(config, done)
return
}

self._fileList = fileList

config.frameworks.forEach(function (framework) {
self._injector.get('framework:' + framework)
})

var webServer = self._injector.get('webServer')
var socketServer = self._injector.get('socketServer')


var singleRunDoneBrowsers = Object.create(null)



var singleRunBrowsers = new BrowserCollection(new EventEmitter())


var singleRunBrowserNotCaptured = false

