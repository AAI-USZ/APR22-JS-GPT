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
this._interceptors.push(fn);
return this;
};

Logger.prototype.pipe = function (emitter) {
this.on('_before_log', function (log) {
emitter.emit('_before_log', log);
});
this.on('log', function (log) {



process.nextTick(function () {
emitter.emit('log', log);
});
});

return emitter;
};

Logger.prototype.geminate = function () {
var logger = new Logger();

logger.pipe(this);
return logger;
};

Logger.prototype.log = function (level, id, message, data) {
var log = {
level: level,
id: id,
message: message,
data: data || {}
};


this.emit('_before_log', log);
this.emit('log', log);

return this;
};



Logger.LEVELS = {
'error': 5,
'conflict': 4,
'warn': 3,
'action': 2,
'info': 1,
'debug': 0
};


Object.keys(Logger.LEVELS).forEach(function (level) {
Logger.prototype[level] = function (id, message, data) {
this.log(level, id, message, data);
};
});

module.exports = Logger;
