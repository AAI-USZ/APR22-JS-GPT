var util = require('./util');
var events = require('./events');
var logger = require('./logger');

var Result = function() {
var startTime = Date.now();

this.total = this.skipped = this.failed = this.success = 0;
this.disconnected = this.error = false;
this.netTime = 0;

this.totalTimeEnd = function() {
this.totalTime = Date.now() - startTime;
};
};

var Browser = function(id, collection, emitter) {
var log = logger.create(id);

this.id = id;
this.name = id;
this.fullName = null;
this.isReady = true;
this.lastResult = new Result();


this.toString = function() {
return this.name;
};

this.onRegister = function(info) {
this.launchId = info.id;
this.fullName = info.name;
this.name = util.browserFullNameToShort(this.fullName);
log = logger.create(this.name);
log.info('Connected on socket id ' + this.id);

emitter.emit('browser_register', this);
emitter.emit('browsers_change', collection);
};

this.onError = function(error) {
if (this.isReady) {
return;
}

this.lastResult.error = true;
emitter.emit('browser_error', this, error);
};

this.onInfo = function(info) {
if (this.isReady) {
