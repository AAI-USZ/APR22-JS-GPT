var Karma  = require('../../client/karma');
var MockSocket = require('./mocks').Socket;


describe('Karma', function() {
var socket, k, spyStart, windowNavigator, windowLocation;

var setTransportTo = function(transportName) {
socket._setTransportNameTo(transportName);
socket.emit('connect');
