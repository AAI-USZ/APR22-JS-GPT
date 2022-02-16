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
var KarmaEventEmitter = events.EventEmitter
var EventEmitter = require('events').EventEmitter
var Executor = require('./executor')
var Browser = require('./browser')
var BrowserCollection = require('./browser_collection')
var EmitterWrapper = require('./emitter_wrapper')
var processWrapper = new EmitterWrapper(process)

const karmaJsPath = path.join(__dirname, '/../static/karma.js')
const contextJsPath = path.join(__dirname, '/../static/context.js')


var browserify = null


function bundleResource (inPath, outPath) {
return new Promise((resolve, reject) => {
browserify = browserify || require('browserify')
var bundler = browserify(inPath)
bundler.bundle().pipe(fs.createWriteStream(outPath))
.once('finish', () => {
resolve()
})
.once('error', (e) => {
reject(e)
})
})
}

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
Object.keys(EventEmitter.prototype).forEach(function (method) {
this[method] = EventEmitter.prototype[method]
}, this)

this.bind = KarmaEventEmitter.prototype.bind.bind(this)
this.emitAsync = KarmaEventEmitter.prototype.emitAsync.bind(this)

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
fileList: ['factory', FileList.factory],
webServer: ['factory', ws.create],
socketServer: ['factory', createSocketIoServer],
executor: ['factory', Executor.factory],

customFileHandlers: ['value', []],

customScriptTypes: ['value', []],
reporter: ['factory', reporter.createReporters],
capturedBrowsers: ['factory', BrowserCollection.factory],
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

webServer.on('error', function (e) {
if (e.code === 'EADDRINUSE') {
self.log.warn('Port %d in use', config.port)
config.port++
webServer.listen(config.port, config.listenAddress)
} else {
throw e
}
})

var afterPreprocess = function () {
if (config.autoWatch) {
self._injector.invoke(watcher.watch)
}

var startWebServer = function () {
webServer.listen(config.port, config.listenAddress, function () {
self.log.info('Karma v%s server started at %s//%s:%s%s', constant.VERSION,
config.protocol, config.listenAddress, config.port, config.urlRoot)

self.emit('listening', config.port)
if (config.browsers && config.browsers.length) {
self._injector.invoke(launcher.launch, launcher).forEach(function (browserLauncher) {
singleRunDoneBrowsers[browserLauncher.id] = false
})
}
var noLoadErrors = self.loadErrors.length
if (noLoadErrors > 0) {
self.log.error('Found %d load error%s', noLoadErrors, noLoadErrors === 1 ? '' : 's')
process.exitCode = 1
process.kill(process.pid, 'SIGINT')
}
})
}


if (!(fs.existsSync(karmaJsPath) && fs.existsSync(contextJsPath))) {
self.log.info('Front-end scripts not present. Compiling...')
var mainPromise = bundleResource(path.join(__dirname, '/../client/main.js'), karmaJsPath)
var contextPromise = bundleResource(path.join(__dirname, '/../context/main.js'), contextJsPath)
Promise.all([mainPromise, contextPromise]).then(() => {
startWebServer()
}).catch((error) => {
self.log.error('Front-end script compile failed with error: ' + error)
process.exitCode = 1
process.kill(process.pid, 'SIGINT')
})
} else {
startWebServer()
}
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
fs.writeSync(browserLogFile, logString + '\n')
})
}

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
}]).invoke(Browser.factory)

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

self.on('browser_complete', function (completedBrowser) {
if (completedBrowser.lastResult.disconnected &&
completedBrowser.disconnectsCount <= config.browserDisconnectTolerance) {
self.log.info('Restarting %s (%d of %d attempts)', completedBrowser.name,
completedBrowser.disconnectsCount, config.browserDisconnectTolerance)

if (!launcher.restart(completedBrowser.id)) {
self.emit('browser_restart_failure', completedBrowser)
}
} else {
self.emit('browser_complete_with_no_more_retries', completedBrowser)
}
})

if (config.singleRun) {
self.on('browser_restart_failure', function (completedBrowser) {
singleRunDoneBrowsers[completedBrowser.id] = true
emitRunCompleteIfAllBrowsersDone()
})
self.on('browser_complete_with_no_more_retries', function (completedBrowser) {
singleRunDoneBrowsers[completedBrowser.id] = true

if (launcher.kill(completedBrowser.id)) {

completedBrowser.state = Browser.STATE_DISCONNECTED
}

emitRunCompleteIfAllBrowsersDone()
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


socketServer.sockets.removeAllListeners()
socketServer.close()


var closeTimeout = setTimeout(removeAllListeners, webServerCloseTimeout)


webServer.close(function () {
clearTimeout(closeTimeout)
removeAllListeners()
})
})
}

processWrapper.on('SIGINT', function () {
disconnectBrowsers(process.exitCode)
})
processWrapper.on('SIGTERM', disconnectBrowsers)



processWrapper.on('uncaughtException', function (error) {
self.log.error(error)
disconnectBrowsers(1)
})
}

Server.prototype._setUpLoadErrorListener = function () {
var self = this
self.on('load_error', function (type, name) {
self.log.debug('Registered a load error of type %s with name %s', type, name)
self.loadErrors.push([type, name])
})
}

Server.prototype._detach = function (config, done) {
var log = this.log
var tmpFile = tmp.fileSync({keep: true})
log.info('Starting karma detached')
log.info('Run "karma stop" to stop the server.')
log.debug('Writing config to tmp-file %s', tmpFile.name)
config.detached = false
try {
fs.writeFileSync(tmpFile.name, JSON.stringify(config), 'utf8')
} catch (e) {
log.error("Couldn't write temporary configuration file")
done(1)
return
}
var child = spawn(process.argv[0], [path.resolve(__dirname, '../lib/detached.js'), tmpFile.name], {
detached: true,
stdio: 'ignore'
})
child.unref()
}




module.exports = Server
