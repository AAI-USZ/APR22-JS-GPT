function EmitterWrapper (emitter) {
this.listeners = {}
this.emitter = emitter
}

EmitterWrapper.prototype.addListener = EmitterWrapper.prototype.on = function (event, listener) {
this.emitter.addListener(event, listener)

if (!this.listeners.hasOwnProperty(event)) {
this.listeners[event] = []
}

this.listeners[event].push(listener)

return this
}

EmitterWrapper.prototype.removeAllListeners = function (event) {
