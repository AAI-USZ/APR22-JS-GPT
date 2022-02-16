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



var READY = 1;


var EXECUTING = 2;


var READY_DISCONNECTED = 3;


var EXECUTING_DISCONNECTED = 4;


var DISCONNECTED = 5;


var Browser = function(id, fullName,   collection, emitter, socket, timer,
disconnectDelay) {

var name = helper.browserFullNameToShort(fullName);
var log = logger.create(name);

this.id = id;
this.fullName = fullName;
this.name = name;
this.state = READY;
this.lastResult = new Result();

this.init = function() {
collection.add(this);

events.bindAll(this, socket);

log.info('Connected on socket %s', socket.id);


emitter.emit('browsers_change', collection);

emitter.emit('browser_register', this);
};

this.isReady = function() {
return this.state === READY;
};

this.toString = function() {
return this.name;
};

this.onError = function(error) {
if (this.isReady()) {
return;
}

this.lastResult.error = true;
emitter.emit('browser_error', this, error);
};

this.onInfo = function(info) {
if (this.isReady()) {
return;
}


if (helper.isDefined(info.dump)) {
emitter.emit('browser_log', this, info.dump, 'dump');
}

if (helper.isDefined(info.log)) {
emitter.emit('browser_log', this, info.log, info.type);
}

if (helper.isDefined(info.total)) {
this.lastResult.total = info.total;
}
};

this.onComplete = function(result) {
if (this.isReady()) {
return;
}

this.state = READY;
this.lastResult.totalTimeEnd();

if (!this.lastResult.success) {
this.lastResult.error = true;
}

emitter.emit('browsers_change', collection);
emitter.emit('browser_complete', this, result);
};

var self = this;
var disconnect = function() {
self.state = DISCONNECTED;
log.warn('Disconnected');
collection.remove(self);
};

var pendingDisconnect;
this.onDisconnect = function() {
if (this.state === READY) {
disconnect();
} else if (this.state === EXECUTING) {
log.debug('Disconnected during run, waiting for reconnecting.');
this.state = EXECUTING_DISCONNECTED;

pendingDisconnect = timer.setTimeout(function() {
self.lastResult.totalTimeEnd();
self.lastResult.disconnected = true;
disconnect();
emitter.emit('browser_complete', self);
}, disconnectDelay);
}
};

this.onReconnect = function(newSocket) {
if (this.state === EXECUTING_DISCONNECTED) {
this.state = EXECUTING;
log.debug('Reconnected.');
} else if (this.state === EXECUTING || this.state === READY) {
log.debug('New connection, forgetting the old one.');

socket.removeAllListeners('disconnect');
}

socket = newSocket;
events.bindAll(this, newSocket);
if (pendingDisconnect) {
timer.clearTimeout(pendingDisconnect);
}
};

this.onResult = function(result) {
if (result.length) {
return result.forEach(this.onResult, this);
}


if (this.isReady()) {
return;
}

if (result.skipped) {
this.lastResult.skipped++;
} else if (result.success) {
this.lastResult.success++;
} else {
this.lastResult.failed++;
}

this.lastResult.netTime += result.time;
emitter.emit('spec_complete', this, result);
};

this.serialize = function() {
return {
id: this.id,
name: this.name,
isReady: this.state === READY
};
};

this.execute = function(config) {
socket.emit('execute', config);
this.state = EXECUTING;
};
};

Browser.STATE_READY = READY;
Browser.STATE_EXECUTING = EXECUTING;
Browser.STATE_READY_DISCONNECTED = READY_DISCONNECTED;
