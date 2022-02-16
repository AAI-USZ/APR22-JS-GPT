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
