

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
windowLocation.search = '?id=567';
socket = new MockSocket();
k = new Karma(socket, {}, windowNavigator, windowLocation);

var spyInfo = jasmine.createSpy('onInfo').andCallFake(function(info) {
expect(info.id).toBe('567');
});

socket.on('register', spyInfo);
socket.emit('connect');

expect(spyInfo).toHaveBeenCalled();
});


describe('result', function() {
var spyResult;

beforeEach(function() {
spyResult = jasmine.createSpy('onResult');
socket.on('result', spyResult);
});

it('should buffer results when polling', function() {
setTransportTo('xhr-polling');


for (var i = 1; i < 50; i++) {
k.result({id: i});
}

expect(spyResult).not.toHaveBeenCalled();

k.result('result', {id: 50});
expect(spyResult).toHaveBeenCalled();
expect(spyResult.argsForCall[0][0].length).toBe(50);
});


it('should buffer results when polling', function() {
setTransportTo('xhr-polling');


for (var i = 1; i <= 40; i++) {
k.result({id: i});
}

k.complete();
expect(spyResult).toHaveBeenCalled();
expect(spyResult.argsForCall[0][0].length).toBe(40);
});


it('should emit "start" with total specs count first', function() {
var log = [];
spyResult.andCallFake(function() {
log.push('result');
});

socket.on('start', function() {
log.push('start');
});
