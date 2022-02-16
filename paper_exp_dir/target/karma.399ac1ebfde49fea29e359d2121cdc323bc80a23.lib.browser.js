this.add = function(browser) {
browsers.push(browser);
emitter.emit('browsers_change', this);
