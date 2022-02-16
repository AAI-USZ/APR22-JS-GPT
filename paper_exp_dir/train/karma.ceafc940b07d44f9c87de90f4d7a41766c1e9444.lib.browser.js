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
failed: 0,
total: 0
};

this.toString = function() {
return this.name;
};

this.onName = function(fullName) {
this.fullName = fullName;
