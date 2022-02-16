var sinon = require('sinon')
var chai = require('chai')
chai.use(require('sinon-chai'))
var expect = chai.expect

var Karma = require('../../client/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var socket, k, windowNavigator, windowLocation, windowStub, startSpy, iframe

var setTransportTo = function (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
}

beforeEach(function () {
socket = new MockSocket()
iframe = {}
windowNavigator = {}
windowLocation = {search: ''}
windowStub = sinon.stub().returns({})

k = new Karma(socket, iframe, windowStub, windowNavigator, windowLocation)
startSpy = sinon.spy(k, 'start')
})

