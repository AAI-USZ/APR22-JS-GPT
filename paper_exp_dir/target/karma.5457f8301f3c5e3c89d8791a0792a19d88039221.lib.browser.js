var Browser = function(id, collection, emitter) {
emitter.emit('browser_error', this, error);
emitter.emit('browser_dump', this, info.dump);
