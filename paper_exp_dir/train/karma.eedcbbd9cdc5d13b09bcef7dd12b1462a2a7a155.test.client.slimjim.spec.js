

describe('slimjim', function() {
var socket, sj, spyStart;

beforeEach(function() {
socket = new MockSocket();
sj = new SlimJim(socket, {});
spyStart = spyOn(sj, 'start');
});


it('should start execution when all files loaded and pass config', function() {
var config = {};

socket.emit('execute', config);
expect(spyStart).not.toHaveBeenCalled();

sj.loaded();
expect(spyStart).toHaveBeenCalledWith(config);
});


it('should not start execution if any error during loading files', function() {
sj.error('syntax error', '/some/file.js', 11);
sj.loaded();

expect(spyStart).not.toHaveBeenCalled();
});

