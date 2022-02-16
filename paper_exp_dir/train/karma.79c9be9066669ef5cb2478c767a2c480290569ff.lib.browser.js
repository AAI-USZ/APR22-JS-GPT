var util = require('./util');
var EventEmitter = require('events').EventEmitter;
var logger = require('./logger');
var format = require('util').format;

var Browser = function(id, collection) {
var log = logger.create(id);

this.id = id;
this.name = id;
this.fullName = null;
this.isReady = true;
this.lastResult = {
