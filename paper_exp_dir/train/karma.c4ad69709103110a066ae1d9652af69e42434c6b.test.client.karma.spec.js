

describe('karma', function() {
var socket, k, spyStart, windowNavigator, windowLocation;

var setTransportTo = function(transportName) {
socket._setTransportNameTo(transportName);
socket.emit('connect');
};


beforeEach(function() {
socket = new MockSocket();
windowNavigator = {};
windowLocation = {search: ''};
