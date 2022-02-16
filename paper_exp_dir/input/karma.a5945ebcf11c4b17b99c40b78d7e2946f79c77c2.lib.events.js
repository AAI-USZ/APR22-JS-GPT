var events = require('events');
var util = require('util');
var Q = require('q');

var helper = require('./helper');


var bindAllEvents = function(object, context) {
context = context || this;

