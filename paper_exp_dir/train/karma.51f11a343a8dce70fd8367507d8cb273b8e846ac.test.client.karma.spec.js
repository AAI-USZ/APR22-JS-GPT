var Karma  = require('../../client/karma');
var MockSocket = require('./mocks').Socket;


describe('Karma', function() {
var socket, k, spyStart, windowNavigator, windowLocation, spyWindowOpener;

var setTransportTo = function(transportName) {
socket._setTransportNameTo(transportName);
socket.emit('connect');
};


beforeEach(function() {
socket = new MockSocket();
windowNavigator = {};
windowLocation = {search: ''};
spyWindowOpener = jasmine.createSpy('window.open').andReturn({});
k = new Karma(socket, {}, spyWindowOpener, windowNavigator, windowLocation);
spyStart = spyOn(k, 'start');
});


it('should start execution when all files loaded and pass config', function() {
var config = {
useIframe: true
};

socket.emit('execute', config);
expect(spyStart).not.toHaveBeenCalled();

k.loaded();
expect(spyStart).toHaveBeenCalledWith(config);
});


it('should open a new window when useIFrame is false', function() {
var config = {
useIframe: false
};

socket.emit('execute', config);
expect(spyStart).not.toHaveBeenCalled();

k.loaded();
expect(spyStart).toHaveBeenCalledWith(config);
expect(spyWindowOpener).toHaveBeenCalledWith('about:blank');
});


it('should not start execution if any error during loading files', function() {
k.error('syntax error', '/some/file.js', 11);
k.loaded();

expect(spyStart).not.toHaveBeenCalled();
});


it('should remove reference to start even after syntax error', function() {
var ADAPTER_START_FN = function() {};

k.start = ADAPTER_START_FN;
k.error('syntax error', '/some/file.js', 11);
k.loaded();
expect(k.start).not.toBe(ADAPTER_START_FN);

k.start = ADAPTER_START_FN;
k.loaded();
expect(k.start).not.toBe(ADAPTER_START_FN);
