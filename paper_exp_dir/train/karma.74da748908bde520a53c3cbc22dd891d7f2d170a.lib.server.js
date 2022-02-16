'use strict'

const SocketIO = require('socket.io')
const di = require('di')
const util = require('util')
const Promise = require('bluebird')
const spawn = require('child_process').spawn
const tmp = require('tmp')
const fs = require('fs')
const path = require('path')
const BundleUtils = require('./utils/bundle-utils')
const NetUtils = require('./utils/net-utils')
const root = global || window || this

const cfg = require('./config')
const logger = require('./logger')
const constant = require('./constants')
const watcher = require('./watcher')
const plugin = require('./plugin')

const createServeFile = require('./web-server').createServeFile
const createServeStaticFile = require('./web-server').createServeStaticFile
const createFilesPromise = require('./web-server').createFilesPromise
const createWebServer = require('./web-server').createWebServer
const preprocessor = require('./preprocessor')
const Launcher = require('./launcher').Launcher
const FileList = require('./file-list')
const reporter = require('./reporter')
const helper = require('./helper')
const events = require('./events')
const KarmaEventEmitter = events.EventEmitter
const EventEmitter = require('events').EventEmitter
const Executor = require('./executor')
const Browser = require('./browser')
const BrowserCollection = require('./browser_collection')
const EmitterWrapper = require('./emitter_wrapper')
const processWrapper = new EmitterWrapper(process)

function createSocketIoServer (webServer, executor, config) {
const server = new SocketIO(webServer, {

destroyUpgrade: false,
path: config.urlRoot + 'socket.io/',
transports: config.transports,
forceJSONP: config.forceJSONP
})


executor.socketIoSockets = server.sockets

return server
}

class Server extends KarmaEventEmitter {
constructor (cliOptions, done) {
super()
logger.setupFromConfig(cliOptions)

this.log = logger.create()

this.loadErrors = []

const config = cfg.parseConfig(cliOptions.configFile, cliOptions)

this.log.debug('Final config', JSON.stringify(config, null, 2))

let modules = [{
helper: ['value', helper],
logger: ['value', logger],
done: ['value', done || process.exit],
emitter: ['value', this],
server: ['value', this],
launcher: ['type', Launcher],
config: ['value', config],
preprocess: ['factory', preprocessor.createPreprocessor],
fileList: ['factory', FileList.factory],
webServer: ['factory', createWebServer],
serveFile: ['factory', createServeFile],
serveStaticFile: ['factory', createServeStaticFile],
filesPromise: ['factory', createFilesPromise],
socketServer: ['factory', createSocketIoServer],
executor: ['factory', Executor.factory],

customFileHandlers: ['value', []],

customScriptTypes: ['value', []],
reporter: ['factory', reporter.createReporters],
capturedBrowsers: ['factory', BrowserCollection.factory],
args: ['value', {}],
timer: ['value', {
setTimeout () {
return setTimeout.apply(root, arguments)
},
clearTimeout
}]
}]

this.on('load_error', (type, name) => {
this.log.debug(`Registered a load error of type ${type} with name ${name}`)
this.loadErrors.push([type, name])
})

modules = modules.concat(plugin.resolve(config.plugins, this))
this._injector = new di.Injector(modules)
}

dieOnError (error) {
this.log.error(error)
process.exitCode = 1
process.kill(process.pid, 'SIGINT')
}

start () {
const config = this.get('config')
return Promise.all([
BundleUtils.bundleResourceIfNotExist('client/main.js', 'static/karma.js'),
BundleUtils.bundleResourceIfNotExist('context/main.js', 'static/context.js')
])
.then(() => NetUtils.bindAvailablePort(config.port, config.listenAddress))
.then((boundServer) => {
config.port = boundServer.address().port
this._boundServer = boundServer
this._injector.invoke(this._start, this)
})
.catch(this.dieOnError.bind(this))
}

get (token) {
return this._injector.get(token)
}

refreshFiles () {
return this._fileList ? this._fileList.refresh() : Promise.resolve()
}

_start (config, launcher, preprocess, fileList, capturedBrowsers, executor, done) {
if (config.detached) {
this._detach(config, done)
return
}

this._fileList = fileList

config.frameworks.forEach((framework) => this._injector.get('framework:' + framework))

const webServer = this._injector.get('webServer')
const socketServer = this._injector.get('socketServer')

const singleRunDoneBrowsers = Object.create(null)
const singleRunBrowsers = new BrowserCollection(new EventEmitter())
let singleRunBrowserNotCaptured = false

webServer.on('error', this.dieOnError.bind(this))

const afterPreprocess = () => {
if (config.autoWatch) {
this._injector.invoke(watcher.watch)
}

webServer.listen(this._boundServer, () => {
this.log.info(`Karma v${constant.VERSION} server started at ${config.protocol}

this.emit('listening', config.port)
if (config.browsers && config.browsers.length) {
this._injector.invoke(launcher.launch, launcher).forEach((browserLauncher) => {
singleRunDoneBrowsers[browserLauncher.id] = false
})
}
if (this.loadErrors.length > 0) {
this.dieOnError(new Error(`Found ${this.loadErrors.length} load error${this.loadErrors.length === 1 ? '' : 's'}`))
}
})
}

fileList.refresh().then(afterPreprocess, afterPreprocess)

this.on('browsers_change', () => socketServer.sockets.emit('info', capturedBrowsers.serialize()))

this.on('browser_register', (browser) => {
launcher.markCaptured(browser.id)

if (launcher.areAllCaptured()) {
this.emit('browsers_ready')

if (config.autoWatch) {
executor.schedule()
}
}
})

if (config.browserConsoleLogOptions && config.browserConsoleLogOptions.path) {
const configLevel = config.browserConsoleLogOptions.level || 'debug'
const configFormat = config.browserConsoleLogOptions.format || '%b %T: %m'
const configPath = config.browserConsoleLogOptions.path
this.log.info(`Writing browser console to file: ${configPath}`)
const browserLogFile = fs.openSync(configPath, 'w+')
const levels = ['log', 'error', 'warn', 'info', 'debug']
this.on('browser_log', function (browser, message, level) {
if (levels.indexOf(level.toLowerCase()) > levels.indexOf(configLevel)) {
return
}
if (!helper.isString(message)) {
message = util.inspect(message, { showHidden: false, colors: false })
}
const logMap = {'%m': message, '%t': level.toLowerCase(), '%T': level.toUpperCase(), '%b': browser}
const logString = configFormat.replace(/%[mtTb]/g, (m) => logMap[m])
this.log.debug(`Writing browser console line: ${logString}`)
fs.writeSync(browserLogFile, logString + '\n')
})
}

socketServer.sockets.on('connection', (socket) => {
this.log.debug('A browser has connected on socket ' + socket.id)

const replySocketEvents = events.bufferEvents(socket, ['start', 'info', 'karma_error', 'result', 'complete'])

socket.on('complete', (data, ack) => ack())

socket.on('register', (info) => {
let newBrowser = info.id ? (capturedBrowsers.getById(info.id) || singleRunBrowsers.getById(info.id)) : null

if (newBrowser) {
newBrowser.reconnect(socket)


if (newBrowser.state === Browser.STATE_DISCONNECTED && config.singleRun) {
newBrowser.execute(config.client)
}
} else {
newBrowser = this._injector.createChild([{
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

const emitRunCompleteIfAllBrowsersDone = () => {
if (Object.keys(singleRunDoneBrowsers).every((key) => singleRunDoneBrowsers[key])) {
this.emit('run_complete', singleRunBrowsers, singleRunBrowsers.getResults(singleRunBrowserNotCaptured, config.failOnEmptyTestSuite, config.failOnFailingTestSuite))
}
}

this.on('browser_complete', (completedBrowser) => {
if (completedBrowser.lastResult.disconnected && completedBrowser.disconnectsCount <= config.browserDisconnectTolerance) {
this.log.info(`Restarting ${completedBrowser.name} (${completedBrowser.disconnectsCount} of ${config.browserDisconnectTolerance} attempts)`)

if (!launcher.restart(completedBrowser.id)) {
this.emit('browser_restart_failure', completedBrowser)
