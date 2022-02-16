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
disconnectDelay,
noActivityTimeout) {

var name = helper.browserFullNameToShort(fullName);
var log = logger.create(name);
var activeSockets = [socket];
var activeSocketsIds = function() {
return activeSockets.map(function(s) {
return s.id;
}).join(', ');
