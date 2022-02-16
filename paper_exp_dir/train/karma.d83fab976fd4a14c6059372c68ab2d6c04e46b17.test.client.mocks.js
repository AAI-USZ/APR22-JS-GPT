var Emitter = function () {
var listeners = {}

this.on = function (event, fn) {
if (!listeners[event]) {
listeners[event] = []
}

listeners[event].push(fn)
}

this.emit = function (event) {
var eventListeners = listeners[event]

if (!eventListeners) return

var i = 0
