var Emitter = function() {
var listeners = {};

this.on = function(event, fn) {
if (!listeners[event]) {
listeners[event] = [];
}

listeners[event].push(fn);
};
