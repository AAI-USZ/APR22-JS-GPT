var Q = require('q');
var util = require('util');
var mout = require('mout');
var events = require('events');

var UnitOfWork = function (options) {

this._options = mout.object.mixIn({
maxConcurrent: 5
}, options);


this._options.maxConcurrent = this._options.maxConcurrent > 0 ? this._options.maxConcurrent : 0;


this._queue = [];
this._beingResolved = [];
};

util.inherits(UnitOfWork, events.EventEmitter);



UnitOfWork.prototype.enqueue = function (resolver) {
var deferred;

if (this.has(resolver)) {
throw new Error('Attempting to enqueue an already enqueued resolver');
}
