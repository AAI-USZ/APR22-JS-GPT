var Karma  = require('../../client/karma');
var MockSocket = require('./mocks').Socket;


describe('Karma', function() {
var socket, k, spyStart, windowNavigator, windowLocation, spywindowOpener;

var setTransportTo = function(transportName) {
socket._setTransportNameTo(transportName);
socket.emit('connect');
};


beforeEach(function() {
socket = new MockSocket();
windowNavigator = {};
windowLocation = {search: ''};
spywindowOpener = spyOn(window, 'open').andReturn({});
k = new Karma(socket, {}, window.open, windowNavigator, windowLocation);
spyStart = spyOn(k, 'start');

});


it('should start execution when all files loaded and pass config', function() {
var config = {
useIframe: true
