import Server from '../../lib/server'
import BrowserCollection from '../../lib/browser_collection'

describe('server', () => {
var mockConfig
var browserCollection
var webServerOnError
var fileListOnReject
var mockLauncher
var mockWebServer
var mockSocketServer
var mockExecutor
var doneSpy
var server = mockConfig = browserCollection = webServerOnError = null
var fileListOnResolve = fileListOnReject = mockLauncher = null
var mockFileList = mockWebServer = mockSocketServer = mockExecutor = doneSpy = null

beforeEach(() => {
browserCollection = new BrowserCollection()
doneSpy = sinon.spy()

fileListOnResolve = fileListOnReject = null

doneSpy = sinon.spy()

mockConfig =
{frameworks: [],
port: 9876,
autoWatch: true,
hostname: 'localhost',
urlRoot: '/',
browsers: ['fake'],
singleRun: true,
logLevel: 'OFF',
browserDisconnectTolerance: 0}

server = new Server(mockConfig, doneSpy)

sinon.stub(server._injector, 'invoke').returns([])

mockExecutor =
{schedule: () => {}}

mockFileList = {
refresh: sinon.spy(() => {
return {
then (onResolve, onReject) {
fileListOnResolve = onResolve
fileListOnReject = onReject
}
}
})
}

mockLauncher = {
launch: () => {},
markCaptured: () => {},
areAllCaptured: () => false,
restart: () => true,
kill: () => true
}

mockSocketServer = {
flashPolicyServer: {
close: () => {}
},
sockets: {
sockets: {},
on: () => {},
emit: () => {}
}
}

mockWebServer = {
on (name, handler) {
if (name === 'error') {
webServerOnError = handler
}
},
listen: sinon.spy((port, callback) => {
callback && callback()
}),
removeAllListeners: () => {},
close: () => {}
}

sinon.stub(server._injector, 'get')
.withArgs('webServer').returns(mockWebServer)
.withArgs('socketServer').returns(mockSocketServer)

webServerOnError = null
})




describe('_start', () => {
it('should start the web server after all files have been preprocessed successfully', () => {
