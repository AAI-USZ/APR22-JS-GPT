

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
k.loaded();
expect(k.start).toBeFalsy();
});


it('should not set up context if there was an error', function() {
var mockWindow = {};

k.error('page reload');
k.setupContext(mockWindow);

expect(mockWindow.__karma__).toBeUndefined();
expect(mockWindow.onbeforeunload).toBeUndefined();
expect(mockWindow.onerror).toBeUndefined();
});


it('should report navigator name', function() {
var spyInfo = jasmine.createSpy('onInfo').andCallFake(function(info) {
expect(info.name).toBe('Fake browser name');
});

windowNavigator.userAgent = 'Fake browser name';
windowLocation.search = '';
socket.on('register', spyInfo);
socket.emit('connect');

expect(spyInfo).toHaveBeenCalled();
});


it('should report browser id', function() {
var spyInfo = jasmine.createSpy('onInfo').andCallFake(function(info) {
expect(info.id).toBe(567);
});

windowLocation.search = '?id=567';
socket.on('register', spyInfo);
socket.emit('connect');

expect(spyInfo).toHaveBeenCalled();
});


describe('setupContext', function() {
it('should capture alert', function() {
spyOn(k, 'log');

var mockWindow = {
alert: function() {
throw 'Alert was not patched!';
}
};

k.setupContext(mockWindow);
