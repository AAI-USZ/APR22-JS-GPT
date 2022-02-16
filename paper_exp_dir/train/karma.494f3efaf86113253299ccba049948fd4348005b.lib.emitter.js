var events = require('events');
var util = require('util');
var u = require('./util');

var bindAllEvents = function(object, context) {
context = context || this;

for (var method in object) {
if (u.isFunction(object[method]) && method.substr(0, 2) === 'on') {
context.on(u.camelToUnderscore(method.substr(2)), object[method].bind(object));
}
}
};

var EventEmitter = function() {
this.bind = bindAllEvents;
};
