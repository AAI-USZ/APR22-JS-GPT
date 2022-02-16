const Server = require('../../lib/server')
const BundleUtils = require('../../lib/utils/bundle-utils')
const NetUtils = require('../../lib/utils/net-utils')
const BrowserCollection = require('../../lib/browser_collection')

describe('server', () => {
let mockConfig
let browserCollection
let webServerOnError
let fileListOnReject
let mockLauncher
let mockWebServer
let mockSocketServer
let mockBoundServer
let mockExecutor
let doneSpy
let server = mockConfig = browserCollection = webServerOnError = null
let fileListOnResolve = fileListOnReject = mockLauncher = null
let mockFileList = mockWebServer = mockSocketServer = mockExecutor = doneSpy = null


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
browserDisconnectTolerance: 0
}

server = new Server(mockConfig, doneSpy)

sinon.stub(server._injector, 'invoke').returns([])

mockExecutor = { schedule: () => {} }

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
}

mockBoundServer = {
on: sinon.spy((event, callback) => callback && callback()),
listen: sinon.spy((port, listenAddress, callback) => callback && callback()),
close: sinon.spy((callback) => callback && callback()),
address: () => { return { port: 9876 } }
}

mockWebServer = {
on (name, handler) {
if (name === 'error') {
webServerOnError = handler
}
},
listen: sinon.spy((port, arg2, arg3) => {
let callback = null
if (typeof arg2 === 'function') {
callback = arg2
} else if (typeof arg3 === 'function') {
callback = arg3
}
callback && callback()
}),
removeAllListeners: () => {},
close: sinon.spy((callback) => callback && callback())
}

sinon
.stub(server._injector, 'get')
.withArgs('webServer').returns(mockWebServer)
.withArgs('socketServer').returns(mockSocketServer)

webServerOnError = null
})

describe('start', () => {
let config
beforeEach(() => {
config = { port: 9876, listenAddress: '127.0.0.1' }
sinon.spy(BundleUtils, 'bundleResourceIfNotExist')
sinon.stub(NetUtils, 'bindAvailablePort').resolves(mockBoundServer)
sinon.stub(mockBoundServer, 'address').returns({ port: 9877 })
sinon
.stub(server, 'get')
.withArgs('config').returns(config)
})

it('should compile static resources', (done) => {
server.start().then(() => {
expect(BundleUtils.bundleResourceIfNotExist).to.have.been.calledWith('client/main.js', 'static/karma.js')
expect(BundleUtils.bundleResourceIfNotExist).to.have.been.calledWith('context/main.js', 'static/context.js')
done()
})
})

it('should search for available port', (done) => {
server.start().then(() => {
expect(NetUtils.bindAvailablePort).to.have.been.calledWith(9876, '127.0.0.1')
expect(mockBoundServer.address).to.have.been.called
done()
})
})

it('should change config.port to available', (done) => {
expect(config.port).to.be.equal(9876)
server.start().then(() => {
expect(config.port).to.be.equal(9877)
expect(server._boundServer).to.be.equal(mockBoundServer)
done()
})
})
})

describe('start on watch mode', () => {
var config
beforeEach(() => {
config = { port: 9876, listenAddress: '127.0.0.1', singleRun: false }
sinon.spy(BundleUtils, 'bundleResourceIfNotExist')
sinon.stub(NetUtils, 'bindAvailablePort').resolves(mockBoundServer)
sinon.stub(mockBoundServer, 'address').returns({ port: 9877 })
sinon
.stub(server, 'get')
.withArgs('config').returns(config)
