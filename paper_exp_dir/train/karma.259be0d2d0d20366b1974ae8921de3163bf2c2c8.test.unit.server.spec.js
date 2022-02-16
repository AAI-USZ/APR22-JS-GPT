const Server = require('../../lib/server')
const BundleUtils = require('../../lib/utils/bundle-utils')
const NetUtils = require('../../lib/utils/net-utils')
const BrowserCollection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')

describe('server', () => {
let mockConfig
let browserCollection
let webServerOnError
let fileListOnReject
let mockLauncher
let mockWebServer
let mockServerSocket
let mockSocketServer
let mockBoundServer
let mockExecutor
let doneSpy
let server = mockConfig = browserCollection = webServerOnError = null
let fileListOnResolve = fileListOnReject = mockLauncher = null
let mockFileList = mockWebServer = mockSocketServer = mockExecutor = doneSpy = null
let mockSocketEventListeners = new Map()


beforeEach(function () {

this.timeout(4000)
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
plugins: [],
browserDisconnectTolerance: 0
}

server = new Server(mockConfig, doneSpy)

sinon.stub(server._injector, 'invoke').returns([])

mockExecutor = { schedule: () => {} }

