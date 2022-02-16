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
