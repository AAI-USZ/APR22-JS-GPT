
require('core-js/es5')
var sinon = require('sinon')
var assert = require('assert')

var ClientKarma = require('../../client/karma')
var ContextKarma = require('../../context/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var socket, k, ck, windowNavigator, windowLocation, windowStub, startSpy, iframe, clientWindow

function setTransportTo (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
}

beforeEach(function () {
socket = new MockSocket()
iframe = {}
windowNavigator = {}
windowLocation = {search: ''}
windowStub = sinon.stub().returns({})

k = new ClientKarma(socket, iframe, windowStub, windowNavigator, windowLocation)
clientWindow = {
karma: k
}
ck = new ContextKarma(ContextKarma.getDirectCallParentKarmaMethod(clientWindow))
ck.config = {}
startSpy = sinon.spy(ck, 'start')
})

it('should start execution when all files loaded and pass config', function () {
var config = ck.config = {
useIframe: true
}

socket.emit('execute', config)
assert(!startSpy.called)

ck.loaded()
assert(startSpy.calledWith(config))
})

it('should open a new window when useIFrame is false', function () {
var config = ck.config = {
useIframe: false,
runInParent: false
}

socket.emit('execute', config)
assert(!ck.start.called)

ck.loaded()
assert(startSpy.calledWith(config))
assert(windowStub.calledWith('context.html'))
})

it('should stop execution', function () {
sinon.spy(k, 'complete')
socket.emit('stop')
assert(k.complete.called)
})

it('should not start execution if any error during loading files', function () {
ck.error('syntax error', '/some/file.js', 11)
ck.loaded()
sinon.spy(ck, 'start')
assert(!startSpy.called)
})

it('should remove reference to start even after syntax error', function () {
function ADAPTER_START_FN () {}

ck.start = ADAPTER_START_FN
ck.error('syntax error', '/some/file.js', 11)
ck.loaded()
assert.notEqual(ck.start, ADAPTER_START_FN)

ck.start = ADAPTER_START_FN
ck.loaded()
assert.notEqual(k.start, ADAPTER_START_FN)
})

it('should not set up context if there was an error', function () {
var config = ck.config = {
clearContext: true
}

socket.emit('execute', config)

var mockWindow = {}

ck.error('page reload')
ck.setupContext(mockWindow)

assert(mockWindow.onbeforeunload == null)
assert(mockWindow.onerror == null)
})

it('should setup context if there was error but clearContext config is false', function () {
var config = ck.config = {
clearContext: false
}

socket.emit('execute', config)

var mockWindow = {}

ck.error('page reload')
ck.setupContext(mockWindow)

assert(mockWindow.onbeforeunload != null)
assert(mockWindow.onerror != null)
})

it('should error out if a script attempted to reload the browser after setup', function () {

var config = ck.config = {
clearContext: true
}
socket.emit('execute', config)
var mockWindow = {}
ck.setupContext(mockWindow)


sinon.spy(k, 'error')


mockWindow.onbeforeunload()


assert(k.error.calledWith('Some of your tests did a full page reload!'))
})

it('should report navigator name', function () {
var spyInfo = sinon.spy(function (info) {
assert(info.name === 'Fake browser name')
})

windowNavigator.userAgent = 'Fake browser name'
windowLocation.search = ''
socket.on('register', spyInfo)
socket.emit('connect')

assert(spyInfo.called)
})

it('should mark "register" event for reconnected socket', function () {
socket.on('register', sinon.spy(function (info) {
assert(info.isSocketReconnect === true)
}))

socket.emit('reconnect')
socket.emit('connect')
})

it('should report browser id', function () {
windowLocation.search = '?id=567'
socket = new MockSocket()
k = new ClientKarma(socket, {}, windowStub, windowNavigator, windowLocation)
