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




Server.prototype._start = function (config, launcher, preprocess, fileList, webServer,
capturedBrowsers, socketServer, executor, done) {
var self = this
if (config.detached) {
this._detach(config, done)
return
}

self._fileList = fileList

config.frameworks.forEach(function (framework) {
self._injector.get('framework:' + framework)
})


var singleRunDoneBrowsers = Object.create(null)



var singleRunBrowsers = new BrowserCollection(new EventEmitter())


var singleRunBrowserNotCaptured = false

webServer.on('error', function (e) {
if (e.code === 'EADDRINUSE') {
self.log.warn('Port %d in use', config.port)
config.port++
webServer.listen(config.port)
} else {
throw e
}
})

var afterPreprocess = function () {
if (config.autoWatch) {
self._injector.invoke(watcher.watch)
}

webServer.listen(config.port, function () {
self.log.info('Karma v%s server started at %s//%s:%s%s', constant.VERSION,
config.protocol, config.hostname, config.port, config.urlRoot)

self.emit('listening', config.port)
if (config.browsers && config.browsers.length) {
self._injector.invoke(launcher.launch, launcher).forEach(function (browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = false
})
}
var noLoadErrors = self.loadErrors.length
if (noLoadErrors > 0) {
self.log.error('Found %d load error%s', noLoadErrors, noLoadErrors === 1 ? '' : 's')
process.kill(process.pid, 'SIGINT')
}
})
}

fileList.refresh().then(afterPreprocess, afterPreprocess)

self.on('browsers_change', function () {

socketServer.sockets.emit('info', capturedBrowsers.serialize())
})

self.on('browser_register', function (browser) {
launcher.markCaptured(browser.id)



if (launcher.areAllCaptured()) {
self.emit('browsers_ready')

if (config.autoWatch) {
executor.schedule()
}
}
})

if (config.browserConsoleLogOptions && config.browserConsoleLogOptions.path) {
var configLevel = config.browserConsoleLogOptions.level || 'debug'
var configFormat = config.browserConsoleLogOptions.format || '%b %T: %m'
var configPath = config.browserConsoleLogOptions.path
self.log.info('Writing browser console to file: %s', configPath)
var browserLogFile = fs.openSync(configPath, 'w+')
var levels = ['log', 'error', 'warn', 'info', 'debug']
self.on('browser_log', function (browser, message, level) {
if (levels.indexOf(level.toLowerCase()) > levels.indexOf(configLevel)) return
if (!helper.isString(message)) {
message = util.inspect(message, {showHidden: false, colors: false})
}
var logMap = {'%m': message, '%t': level.toLowerCase(), '%T': level.toUpperCase(), '%b': browser}
var logString = configFormat.replace(/%[mtTb]/g, function (m) {
return logMap[m]
})
self.log.debug('Writing browser console line: %s', logString)
