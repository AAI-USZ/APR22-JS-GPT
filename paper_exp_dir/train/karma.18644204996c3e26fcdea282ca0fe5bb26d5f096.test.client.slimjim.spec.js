

describe('testacular', function() {
var socket, tc, spyStart;

beforeEach(function() {
socket = new MockSocket();
tc = new Testacular(socket, {});
spyStart = spyOn(tc, 'start');
});


it('should start execution when all files loaded and pass config', function() {
var config = {};

socket.emit('execute', config);
expect(spyStart).not.toHaveBeenCalled();

tc.loaded();
expect(spyStart).toHaveBeenCalledWith(config);
});


it('should not start execution if any error during loading files', function() {
tc.error('syntax error', '/some/file.js', 11);
tc.loaded();

expect(spyStart).not.toHaveBeenCalled();
});


it('should remove reference to start even after syntax error', function() {
tc.error('syntax error', '/some/file.js', 11);
tc.loaded();
expect(tc.start).toBeFalsy();
