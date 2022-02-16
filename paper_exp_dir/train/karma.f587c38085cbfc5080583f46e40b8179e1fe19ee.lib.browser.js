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
skipped: 0,
disconnected: false,
error: false
};

this.toString = function() {
return this.name;
};

this.onName = function(fullName) {
