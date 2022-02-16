var Server = require('../../lib/server')
var BrowserCollection = require('../../lib/browser_collection')
var fs = require('fs')
var path = require('path')

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

mockConfig = {
frameworks: [],
port: 9876,
autoWatch: true,
listenAddress: '127.0.0.1',
hostname: 'localhost',
urlRoot: '/',
browsers: ['fake'],
singleRun: true,
logLevel: 'OFF',
browserDisconnectTolerance: 0
}

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
close: () => {},
flashPolicyServer: {
close: () => {}
},
sockets: {
sockets: {},
on: () => {},
emit: () => {},
removeAllListeners: () => {}
}
