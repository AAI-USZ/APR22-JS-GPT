var SocketIO = require('socket.io')
var di = require('di')
var util = require('util')
var Promise = require('bluebird')

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
timer: ['value', {setTimeout: setTimeout, clearTimeout: clearTimeout}]
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

