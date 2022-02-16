

describe('karma', function() {
var socket, k, spyStart, windowNavigator, windowLocation;

beforeEach(function() {
socket = new MockSocket();
windowNavigator = {};
windowLocation = {};
k = new Karma(socket, {}, windowNavigator, windowLocation);
spyStart = spyOn(k, 'start');
});


it('should start execution when all files loaded and pass config', function() {
var config = {};

socket.emit('execute', config);
expect(spyStart).not.toHaveBeenCalled();

k.loaded();
expect(spyStart).toHaveBeenCalledWith(config);
});


it('should not start execution if any error during loading files', function() {
k.error('syntax error', '/some/file.js', 11);
k.loaded();

expect(spyStart).not.toHaveBeenCalled();
});


it('should remove reference to start even after syntax error', function() {
k.error('syntax error', '/some/file.js', 11);
k.loaded();
expect(k.start).toBeFalsy();

k.start = function() {};
