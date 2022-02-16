var Q = require('q');
var util = require('util');
var events = require('events');
var mout = require('mout');

var Worker = function (defaultConcurrency, types) {
this._defaultConcurrency = typeof defaultConcurrency === 'number' ? defaultConcurrency : 10;


this._queue = {};
this._slots = types || {};
this._executing = [];
};

util.inherits(Worker, events.EventEmitter);



Worker.prototype.enqueue = function (func, type) {
var deferred = Q.defer(),
types,
entry;

type = type || '';
types = Array.isArray(type) ? type : [type];
entry = {
func: func,
types: types,
deferred: deferred
};


types.forEach(function (type) {
this._queue[type] = this._queue[type] || [];
this._queue[type].push(entry);
}, this);


Q.fcall(this._processEntry.bind(this, entry));

return deferred.promise;
};

Worker.prototype.abort = function () {
var promises;


Object.keys(this._queue).forEach(function (type) {
this._queue[type] = [];
}, this);


promises = this._executing.map(function (entry) {
