
require('core-js/es5')
global.JSON = require('json3')
var sinon = require('sinon')
var assert = require('assert')

var ClientKarma = require('../../client/karma')
var ContextKarma = require('../../context/karma')
var MockSocket = require('./mocks').Socket

describe('Karma', function () {
var socket, k, ck, windowNavigator, windowLocation, windowStub, startSpy, iframe, clientWindow

var setTransportTo = function (transportName) {
socket._setTransportNameTo(transportName)
socket.emit('connect')
