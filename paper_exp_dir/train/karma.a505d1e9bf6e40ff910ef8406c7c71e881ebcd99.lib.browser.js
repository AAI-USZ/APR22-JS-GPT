var util = require('./util');
var events = require('./events');
var logger = require('./logger');

var Browser = function(id, collection, emitter) {
var log = logger.create(id);

this.id = id;
this.name = id;
this.fullName = null;
this.isReady = true;


this.lastResult = {
success: 0,
failed: 0,
total: 0,
disconnected: false,
error: false
};

this.toString = function() {
return this.name;
};

this.onName = function(fullName) {
this.fullName = fullName;
this.name = util.browserFullNameToShort(fullName);
log = logger.create(this.name);
log.info('Connected on socket id ' + this.id);
emitter.emit('browsers_change', collection);
};

this.onError = function(error) {
if (this.isReady) return;

this.lastResult.error = true;
emitter.emit('browser_error', this, error);
};

this.onInfo = function(info) {
if (this.isReady) return;

if (util.isDefined(info.dump)) {
emitter.emit('browser_dump', this, info.dump);
