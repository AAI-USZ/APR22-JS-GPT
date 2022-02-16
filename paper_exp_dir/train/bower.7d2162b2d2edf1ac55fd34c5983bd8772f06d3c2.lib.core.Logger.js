var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Logger() {
this._interceptors = [];


this.on('_before_log', function (log) {
this._interceptors.forEach(function (interceptor) {
interceptor(log);
});
});
}

util.inherits(Logger, EventEmitter);

Logger.prototype.intercept = function (fn) {
