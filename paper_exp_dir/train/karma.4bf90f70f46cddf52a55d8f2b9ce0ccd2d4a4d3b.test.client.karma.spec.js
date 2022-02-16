var sinon = require('sinon')
var assert = require('assert')

var ClientKarma = require('../../client/karma')
var ContextKarma = require('../../context/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var updater, socket, k, ck, windowNavigator, windowLocation, windowStub, startSpy, iframe, clientWindow
var windowDocument, elements, mockTestStatus

function setTransportTo (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
}

beforeEach(function () {
mockTestStatus = ''
updater = {
updateTestStatus: (s) => {
mockTestStatus = s
}
}
socket = new MockSocket()
iframe = {}
