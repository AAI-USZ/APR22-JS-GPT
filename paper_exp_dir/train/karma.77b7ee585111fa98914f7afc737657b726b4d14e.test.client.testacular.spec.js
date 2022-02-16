

describe('testacular', function() {
var socket, tc, spyStart, windowNavigator, windowLocation;

beforeEach(function() {
socket = new MockSocket();
windowNavigator = {};
windowLocation = {};
tc = new Testacular(socket, {}, windowNavigator, windowLocation);
spyStart = spyOn(tc, 'start');
});


it('should start execution when all files loaded and pass config', function() {
var config = {};
