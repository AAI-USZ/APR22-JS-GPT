


var util = require('./utils');
var EventEmitter = util.EventEmitter;



function Promise (back) {
this.emitted = {};
if ('function' == typeof back)
this.addBack(back);
};



Promise.prototype.__proto__ = EventEmitter.prototype;



Promise.prototype.on = function (event, callback) {
if (this.emitted[event])
callback.apply(this, this.emitted[event]);
else
EventEmitter.prototype.on.call(this, event, callback);

return this;
};



Promise.prototype.emit = function (event) {

if (event == 'err' || event == 'complete'){
if (this.emitted.err || this.emitted.complete) {
return this;
}
this.emitted[event] = util.args(arguments, 1);
}

return EventEmitter.prototype.emit.apply(this, arguments);
};



Promise.prototype.complete = function () {
var args = util.args(arguments);
return this.emit.apply(this, ['complete'].concat(args));
};



Promise.prototype.error = function () {
var args = util.args(arguments);
return this.emit.apply(this, ['err'].concat(args));
};



Promise.prototype.addCallback = function (fn) {
return this.on('complete', fn);
};



Promise.prototype.addErrback = function (fn) {
return this.on('err', fn);
};



Promise.prototype.addBack = function (fn) {
this.on('err', function(err){
fn.call(this, err);
});

this.on('complete', function(){
var args = util.args(arguments);
fn.apply(this, [null].concat(args));
});

return this;
};



Promise.prototype.resolve = function (err, val) {
if (err) return this.error(err);
return this.complete(val);
};



module.exports = Promise;
