const Server = require('../../lib/server')
const NetUtils = require('../../lib/utils/net-utils')
const BrowserCollection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')
const logger = require('../../lib/logger')

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
let doneStub
let logErrorSpy
let server = mockConfig = browserCollection = webServerOnError = null
let fileListOnResolve = fileListOnReject = mockLauncher = null
let mockFileList = mockWebServer = mockSocketServer = mockExecutor = doneStub = null
const mockSocketEventListeners = new Map()


beforeEach(function () {

this.timeout(4000)
browserCollection = new BrowserCollection()
doneStub = sinon.stub()
logErrorSpy = sinon.spy(logger.create('karma-server'), 'error')

fileListOnResolve = fileListOnReject = null

mockConfig = {
frameworks: [],
port: 9876,
autoWatch: true,
listenAddress: '127.0.0.1',
hostname: 'localhost',
urlRoot: '/',
