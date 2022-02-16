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
const createReadFilePromise = require('./web-server').createReadFilePromise
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

this.log = logger.create('karma-server')

this.loadErrors = []

const config = cfg.parseConfig(cliOptions.configFile, cliOptions)

this.log.debug('Final config', util.inspect(config, false,   null))

let modules = [{
helper: ['value', helper],
logger: ['value', logger],
done: ['value', done || process.exit],
emitter: ['value', this],
server: ['value', this],
watcher: ['value', watcher],
launcher: ['type', Launcher],
config: ['value', config],
preprocess: ['factory', preprocessor.createPreprocessor],
fileList: ['factory', FileList.factory],
webServer: ['factory', createWebServer],
serveFile: ['factory', createServeFile],
serveStaticFile: ['factory', createServeStaticFile],
filesPromise: ['factory', createFilesPromise],
readFilePromise: ['factory', createReadFilePromise],
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

async start () {
const config = this.get('config')
try {
await Promise.all([
BundleUtils.bundleResourceIfNotExist('client/main.js', 'static/karma.js'),
BundleUtils.bundleResourceIfNotExist('context/main.js', 'static/context.js')
])
this._boundServer = await NetUtils.bindAvailablePort(config.port, config.listenAddress)
this._boundServer.on('connection', (socket) => {

socket.on('error', (err) => {

this.log.debug('Ignoring error on webserver connection: ' + err)
})
})
config.port = this._boundServer.address().port
await this._injector.invoke(this._start, this)
} catch (err) {
this.dieOnError(`Server start failed on port ${config.port}: ${err}`)
}
}

get (token) {
return this._injector.get(token)
}

refreshFiles () {
return this._fileList ? this._fileList.refresh() : Promise.resolve()
}

refreshFile (path) {
return this._fileList ? this._fileList.changeFile(path) : Promise.resolve()
}

async _start (config, launcher, preprocess, fileList, capturedBrowsers, executor, done) {
if (config.detached) {
this._detach(config, done)
return
}

this._fileList = fileList

await Promise.all(
config.frameworks.map((framework) => this._injector.get('framework:' + framework))
)

const webServer = this._injector.get('webServer')
const socketServer = this._injector.get('socketServer')

const singleRunDoneBrowsers = Object.create(null)
