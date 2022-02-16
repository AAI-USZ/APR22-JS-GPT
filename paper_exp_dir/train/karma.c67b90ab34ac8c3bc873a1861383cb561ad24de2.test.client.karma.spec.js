
require('core-js/es5')
global.JSON = require('json3')
const sinon = require('sinon')
const assert = require('assert')

const ClientKarma = require('../../client/karma')
const ContextKarma = require('../../context/karma')
const MockSocket = require('./mocks').Socket

describe('Karma', function () {
let socket, k, ck, windowNavigator, windowLocation, windowStub, startSpy, iframe, clientWindow

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
const config = ck.config = {
useIframe: true
}

socket.emit('execute', config)
assert(!startSpy.called)

ck.loaded()
assert(startSpy.calledWith(config))
})

it('should open a new window when useIFrame is false', function () {
const config = ck.config = {
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
const config = ck.config = {
clearContext: true
}

socket.emit('execute', config)

const mockWindow = {}
