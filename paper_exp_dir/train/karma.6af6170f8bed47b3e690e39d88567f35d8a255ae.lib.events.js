var events = require('events');
var util = require('util');
var Q = require('q');

var helper = require('./helper');


var bindAllEvents = function(object, context) {
context = context || this;

for (var method in object) {
if (helper.isFunction(object[method]) && method.substr(0, 2) === 'on') {
context.on(helper.camelToSnake(method.substr(2)), object[method].bind(object));
