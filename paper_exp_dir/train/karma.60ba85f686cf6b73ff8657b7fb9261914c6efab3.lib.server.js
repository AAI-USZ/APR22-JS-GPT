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

function setupLogger (level, colors) {
var logLevel = logLevel || constant.LOG_INFO
var logColors = helper.isDefined(colors) ? colors : true
logger.setup(logLevel, logColors, [constant.CONSOLE_APPENDER])
}


var Server = function (cliOptions, done) {
EventEmitter.call(this)

setupLogger(cliOptions.logLevel, cliOptions.colors)

this.log = logger.create()

var config = cfg.parseConfig(cliOptions.configFile, cliOptions)

var modules = [{
helper: ['value', helper],
logger: ['value', logger],
done: ['value', done || process.exit],
emitter: ['value', this],
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


modules = modules.concat(plugin.resolve(config.plugins))

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

if (config.browsers && config.browsers.length) {
self._injector.invoke(launcher.launch, launcher).forEach(function (browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = false
})
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

var EVENTS_TO_REPLY = ['start', 'info', 'karma_error', 'result', 'complete']
socketServer.sockets.on('connection', function (socket) {
self.log.debug('A browser has connected on socket ' + socket.id)

var replySocketEvents = events.bufferEvents(socket, EVENTS_TO_REPLY)

socket.on('complete', function (data, ack) {
ack()
})

socket.on('register', function (info) {
var newBrowser
var isRestart

if (info.id) {
newBrowser = capturedBrowsers.getById(info.id) || singleRunBrowsers.getById(info.id)
}

if (newBrowser) {
isRestart = newBrowser.state === Browser.STATE_DISCONNECTED
newBrowser.reconnect(socket)


if (isRestart && config.singleRun) {
newBrowser.execute(config.client)
}
} else {
newBrowser = self._injector.createChild([{
id: ['value', info.id || null],
fullName: ['value', (helper.isDefined(info.displayName) ? info.displayName : info.name)],
socket: ['value', socket]
}]).instantiate(Browser)

newBrowser.init()


if (config.singleRun) {
newBrowser.execute(config.client)
singleRunBrowsers.add(newBrowser)
}
}

replySocketEvents()
})
})

var emitRunCompleteIfAllBrowsersDone = function () {

var isDone = Object.keys(singleRunDoneBrowsers).reduce(function (isDone, id) {
return isDone && singleRunDoneBrowsers[id]
}, true)

if (isDone) {
var results = singleRunBrowsers.getResults()
if (singleRunBrowserNotCaptured) {
results.exitCode = 1
} else if (results.success + results.failed === 0 && !config.failOnEmptyTestSuite) {
results.exitCode = 0
self.log.warn('Test suite was empty.')
}
self.emit('run_complete', singleRunBrowsers, results)
}
}

if (config.singleRun) {
self.on('browser_complete', function (completedBrowser) {
if (completedBrowser.lastResult.disconnected &&
completedBrowser.disconnectsCount <= config.browserDisconnectTolerance) {
self.log.info('Restarting %s (%d of %d attempts)', completedBrowser.name,
completedBrowser.disconnectsCount, config.browserDisconnectTolerance)
if (!launcher.restart(completedBrowser.id)) {
singleRunDoneBrowsers[completedBrowser.id] = true
emitRunCompleteIfAllBrowsersDone()
}
} else {
singleRunDoneBrowsers[completedBrowser.id] = true

if (launcher.kill(completedBrowser.id)) {

completedBrowser.state = Browser.STATE_DISCONNECTED
}

emitRunCompleteIfAllBrowsersDone()
}
})

self.on('browser_process_failure', function (browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = true
singleRunBrowserNotCaptured = true

emitRunCompleteIfAllBrowsersDone()
})

self.on('run_complete', function (browsers, results) {
self.log.debug('Run complete, exiting.')
disconnectBrowsers(results.exitCode)
})

self.emit('run_start', singleRunBrowsers)
}

if (config.autoWatch) {
self.on('file_list_modified', function () {
self.log.debug('List of files has changed, trying to execute')
if (config.restartOnFileChange) {
socketServer.sockets.emit('stop')
}
executor.schedule()
})
}

var webServerCloseTimeout = 3000
var disconnectBrowsers = function (code) {



var sockets = socketServer.sockets.sockets

Object.keys(sockets).forEach(function (id) {
var socket = sockets[id]
socket.removeAllListeners('disconnect')
if (!socket.disconnected) {


process.nextTick(socket.disconnect.bind(socket))
}
})

var removeAllListenersDone = false
var removeAllListeners = function () {

if (removeAllListenersDone) {
return
}
removeAllListenersDone = true
webServer.removeAllListeners()
processWrapper.removeAllListeners()
done(code || 0)
}

self.emitAsync('exit').then(function () {


var closeTimeout = setTimeout(removeAllListeners, webServerCloseTimeout)


webServer.close(function () {
clearTimeout(closeTimeout)
removeAllListeners()
})
})
}

processWrapper.on('SIGINT', disconnectBrowsers)
processWrapper.on('SIGTERM', disconnectBrowsers)



processWrapper.on('uncaughtException', function (error) {
self.log.error(error)
disconnectBrowsers(1)
})
}




module.exports = Server
