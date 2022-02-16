var util = require('./util');
var EventEmitter = require('events').EventEmitter;
var logger = require('./logger');

var Browser = function(id, collection, reporter) {
var log = logger.create(id);

this.id = id;
this.name = id;
this.fullName = null;
this.isReady = true;
this.lastResult = {
success: 0,
failed: 0
};

this.toString = function() {
return this.name;
};

this.onName = function(fullName) {
this.fullName = fullName;
this.name = util.browserFullNameToShort(fullName);
log = logger.create(this.name);
log.info('Connected on socket id ' + this.id);
collection.emit('change');
};

this.onError = function(error) {
reporter.error(this, error);
};

this.onInfo = function(info) {
log.info(info);

};

this.onComplete = function() {
this.isReady = true;
collection.emit('change');
reporter.browserComplete(this);
};

this.onDisconnect = function() {
