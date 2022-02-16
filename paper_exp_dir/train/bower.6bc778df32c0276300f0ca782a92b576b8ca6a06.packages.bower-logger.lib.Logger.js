var EventEmitter = require('events').EventEmitter;
var util = require('util');

var slice = Array.prototype.slice;

function Logger() {
this._interceptors = [];
this._piped = [];
}

util.inherits(Logger, EventEmitter);

Logger.prototype.intercept = function(fn) {
this._interceptors.push(fn);
return this;
};

Logger.prototype.emit = function() {
var ret;
var args = slice.call(arguments);


if (args[0] === 'log') {
this._interceptors.forEach(function(interceptor) {
interceptor.apply(this, args.slice(1));
});
}

ret = EventEmitter.prototype.emit.apply(this, args);


this._piped.forEach(function(emitter) {
emitter.emit.apply(emitter, args);
});

return ret;
};

Logger.prototype.pipe = function(emitter) {
this._piped.push(emitter);

return emitter;
};

Logger.prototype.geminate = function() {
var logger = new Logger();

logger.pipe(this);
return logger;
};

Logger.prototype.log = function(level, id, message, data) {
var log = {
level: level,
id: id,
message: message,
data: data || {}
};


this.emit('log', log);

return this;
};

Logger.prototype.prompt = function(prompts, callback) {
var fn;
var one;
var invalid;
var runned;
var error;
var validPrompts = Logger._validPrompts;

if (!Array.isArray(prompts)) {
prompts.name = 'prompt';
prompts = [prompts];
one = true;
}


invalid = prompts.some(function(prompt) {
return validPrompts.indexOf(prompt.type) === -1;
});

if (invalid) {
error = new Error('Unknown prompt type');
error.code = 'ENOTSUP';
return callback(error);
}

fn = function(answers) {
