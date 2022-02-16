var sinon = require('sinon')
var assert = require('assert')

var ClientKarma = require('../../client/karma')
var ContextKarma = require('../../context/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var socket, k, ck, windowNavigator, windowLocation, windowStub, startSpy, iframe, clientWindow
var windowDocument, elements

function setTransportTo (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
}

beforeEach(function () {
socket = new MockSocket()
iframe = {}
windowNavigator = {}
windowLocation = { search: '' }
windowStub = sinon.stub().returns({})
elements = [{ style: {} }, { style: {} }]
windowDocument = { querySelectorAll: sinon.stub().returns(elements) }

k = new ClientKarma(socket, iframe, windowStub, windowNavigator, windowLocation, windowDocument)
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

it('should open a new window when useIFrame is false', function (done) {
var config = ck.config = {
useIframe: false,
runInParent: false
}

socket.emit('execute', config)
setTimeout(function nextEventLoop () {
assert(!ck.start.called)

ck.loaded()
assert(startSpy.calledWith(config))
assert(windowStub.calledWith('context.html'))
done()
})
})

it('should not set style on elements', function (done) {
var config = {}
socket.emit('execute', config)
setTimeout(function nextEventLoop () {
assert(Object.keys(elements[0].style).length === 0)
done()
})
})

it('should set display none on elements if clientDisplayNone', function (done) {
var config = { clientDisplayNone: true }
socket.emit('execute', config)
setTimeout(function nextEventLoop () {
assert(elements[0].style.display === 'none')
assert(elements[1].style.display === 'none')
done()
})
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
assert.notStrictEqual(ck.start, ADAPTER_START_FN)

ck.start = ADAPTER_START_FN
ck.loaded()
assert.notStrictEqual(k.start, ADAPTER_START_FN)
})

it('should not set up context if there was an error', function (done) {
var config = ck.config = {
clearContext: true
}

socket.emit('execute', config)

setTimeout(function nextEventLoop () {
var mockWindow = {}

ck.error('page reload')
ck.setupContext(mockWindow)

assert(mockWindow.onbeforeunload == null)
assert(mockWindow.onerror == null)
done()
})
})

it('should setup context if there was error but clearContext config is false', function (done) {
var config = ck.config = {
clearContext: false
}

socket.emit('execute', config)

setTimeout(function nextEventLoop () {
var mockWindow = {}

ck.error('page reload')
ck.setupContext(mockWindow)

assert(mockWindow.onbeforeunload != null)
assert(mockWindow.onerror != null)
done()
})
})

it('should error out if a script attempted to reload the browser after setup', function (done) {

var config = ck.config = {
clearContext: false
}
socket.emit('execute', config)

setTimeout(function nextEventLoop () {
var mockWindow = {}
ck.setupContext(mockWindow)


sinon.spy(k, 'error')


mockWindow.onbeforeunload()


assert(k.error.calledWith('Some of your tests did a full page reload!'))
done()
})
})

it('should error out if a script attempted to reload the browser after setup with clearContext true', function (done) {

var config = ck.config = {
clearContext: true
}
socket.emit('execute', config)

setTimeout(function nextEventLoop () {
var mockWindow = {}
ck.setupContext(mockWindow)


sinon.spy(k, 'error')


mockWindow.onbeforeunload()


assert(k.error.calledWith('Some of your tests did a full page reload!'))
done()
})
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

socket.emit('connect')

socket.on('register', sinon.spy(function (info) {
assert(info.isSocketReconnect === true)
}))

socket.emit('connect')
})

