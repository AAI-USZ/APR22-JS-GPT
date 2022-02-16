describe('plus', function() {


var socket = function() {
var location = window.parent.location;
return window.parent.io.sockets[location.protocol + '//' + location.host];
};

it('should pass', function() {
expect(1).toBe(1);
});

it('should disconnect', function(done) {
console.log(2);
