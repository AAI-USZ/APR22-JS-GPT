var util = require('./util');
var EventEmitter = require('events').EventEmitter;
var logger = require('./logger');

var Browser = function(id, collection) {
var log = logger.create(id);

this.id = id;
this.name = id;
this.fullName = null;
this.isReady = true;

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
log.error(util.formatError(error, '\t'));
};

this.onInfo = function(info) {
log.info(info);
};
