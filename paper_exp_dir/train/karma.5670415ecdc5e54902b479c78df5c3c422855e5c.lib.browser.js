var helper = require('./helper');
var events = require('./events');
var logger = require('./logger');


var Result = function() {
var startTime = Date.now();

this.total = this.skipped = this.failed = this.success = 0;
this.netTime = this.totalTime = 0;
this.disconnected = this.error = false;

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
this.name = helper.browserFullNameToShort(this.fullName);
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
return;
}


if (helper.isDefined(info.dump)) {
emitter.emit('browser_dump', this, info.dump);
}

if (helper.isDefined(info.total)) {
this.lastResult.total = info.total;
}
};

this.onComplete = function(result) {
if (this.isReady) {
return;
}

this.isReady = true;
this.lastResult.totalTimeEnd();

if (!this.lastResult.success) {
this.lastResult.error = true;
}

emitter.emit('browsers_change', this);
emitter.emit('browser_complete', this, result);
};

this.onDisconnect = function() {
