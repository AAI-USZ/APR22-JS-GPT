
require('core-js/es5')
global.JSON = require('json3')
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
