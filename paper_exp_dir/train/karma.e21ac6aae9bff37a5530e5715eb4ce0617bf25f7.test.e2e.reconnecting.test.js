describe('plus', function() {

var breath = function() {
var finished = false;
setTimeout(function() {
finished = true;
}, 0)

waitsFor(function() {
return finished;
});
};


var socket = function() {
var location = window.parent.location;
return window.parent.io.sockets[location.protocol + '//' + location.host];
};

it('should pass', function() {
expect(1).toBe(1);
});

it('should disconnect', function() {
expect(2).toBe(2);
socket().disconnect();

breath();
});
