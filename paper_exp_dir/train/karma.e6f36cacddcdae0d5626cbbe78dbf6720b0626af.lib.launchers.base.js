var KarmaEventEmitter = require('../events').EventEmitter;
var EventEmitter = require('events').EventEmitter;
var q = require('q');
var log = require('../logger').create('launcher');

var BEING_CAPTURED = 1;
var CAPTURED = 2;
var BEING_KILLED = 3;
var FINISHED = 4;
var RESTARTING = 5;
var BEING_FORCE_KILLED = 6;
