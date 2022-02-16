var helper = require('./helper');
var events = require('./events');
var logger = require('./logger');

var Result = require('./browser_result');



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
this.disconnectsCount = 0;

this.init = function() {
collection.add(this);

events.bindAll(this, socket);

log.info('Connected on socket %s with id %s', socket.id, id);


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
};

this.onStart = function(info) {
this.lastResult = new Result();
this.lastResult.total = info.total;

if (info.total === null) {
log.warn('Adapter did not report total number of specs.');
}

emitter.emit('browser_start', this, info);
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
self.disconnectsCount++;
log.warn('Disconnected');
collection.remove(self);
};

var pendingDisconnect;
this.onDisconnect = function() {
if (this.state === READY) {
disconnect();
} else if (this.state === EXECUTING) {
log.debug('Disconnected during run, waiting %sms for reconnecting.', disconnectDelay);
this.state = EXECUTING_DISCONNECTED;

pendingDisconnect = timer.setTimeout(function() {
self.lastResult.totalTimeEnd();
self.lastResult.disconnected = true;
disconnect();
emitter.emit('browser_complete', self);
}, disconnectDelay);
}
};

this.reconnect = function(newSocket) {
if (this.state === EXECUTING_DISCONNECTED) {
this.state = EXECUTING;
log.debug('Reconnected.');
} else if (this.state === EXECUTING || this.state === READY) {
log.debug('New connection %s, forgetting %s.', newSocket.id, socket.id);

socket.removeAllListeners('disconnect');
} else if (this.state === DISCONNECTED) {
this.state = READY;
log.info('Connected on socket %s with id %s', newSocket.id, this.id);
collection.add(this);


emitter.emit('browsers_change', collection);

emitter.emit('browser_register', this);
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

this.lastResult.add(result);

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
Browser.STATE_EXECUTING_DISCONNECTED = EXECUTING_DISCONNECTED;
Browser.STATE_DISCONNECTED = DISCONNECTED;


module.exports = Browser;
