var sinon = require('sinon')
var chai = require('chai')
chai.use(require('sinon-chai'))
var expect = chai.expect

var Karma = require('../../client/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var socket, k, windowNavigator, windowLocation, windowStub, startSpy

var setTransportTo = function (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
}

beforeEach(function () {
socket = new MockSocket()
windowNavigator = {}
windowLocation = {search: ''}
windowStub = sinon.stub().returns({})

k = new Karma(socket, {}, windowStub, windowNavigator, windowLocation)
startSpy = sinon.spy(k, 'start')
})

it('should start execution when all files loaded and pass config', function () {
var config = {
useIframe: true
}

socket.emit('execute', config)
expect(startSpy).to.not.have.been.called

k.loaded()
expect(startSpy).to.have.been.calledWith(config)
})

it('should open a new window when useIFrame is false', function () {
var config = {
useIframe: false
}

socket.emit('execute', config)
expect(k.start).to.not.have.been.called

k.loaded()
expect(startSpy).to.have.been.calledWith(config)
expect(windowStub).to.have.been.calledWith('about:blank')
})

it('should stop execution', function () {
sinon.spy(k, 'complete')
socket.emit('stop')
expect(k.complete).to.have.been.called
})

it('should not start execution if any error during loading files', function () {
k.error('syntax error', '/some/file.js', 11)
k.loaded()
sinon.spy(k, 'start')
