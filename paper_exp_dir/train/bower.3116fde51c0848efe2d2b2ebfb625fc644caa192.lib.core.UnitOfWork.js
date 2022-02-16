var Q = require('q');
var util = require('util');
var mout = require('mout');
var events = require('events');
var createError = require('../util/createError');

var UnitOfWork = function (options) {

this._options = mout.object.mixIn({
failFast: true,
maxConcurrent: 5
}, options);


this._options.failFast = !!this._options.failFast;
this._options.maxConcurrent = this._options.maxConcurrent > 0 ? this._options.maxConcurrent : 0;


this._queue = [];
this._beingResolved = [];
this._beingResolvedEndpoints = {};
this._resolved = {};
this._failed = {};
this._completed = {};
};

util.inherits(UnitOfWork, events.EventEmitter);



UnitOfWork.prototype.enqueue = function (pkg) {
var deferred = Q.defer(),
index;


index = this._indexOf(this._queue, pkg);
if (index !== -1) {
throw new Error('Package is already queued');
}


index = this._indexOf(this._beingResolved, pkg);
if (index !== -1) {
throw new Error('Package is already being resolved');
}


this._queue.push({
pkg: pkg,
deferred: deferred
});
this.emit('enqueue', pkg);


Q.fcall(this._processQueue.bind(this));

return deferred.promise;
};

UnitOfWork.prototype.dequeue = function (pkg) {
var index;


index = this._indexOf(this._beingResolved, pkg);
if (index !== -1) {
throw new Error('Package is already being resolved');
}


index = this._indexOf(this._queue, pkg);
if (index !== -1) {
this._queue.splice(index, 1);
this.emit('dequeue', pkg);
}

return this;
};

UnitOfWork.prototype.getResolved = function (name) {
return name ? this._resolved[name] || [] : this._resolved;
};

UnitOfWork.prototype.getFailed = function (name) {
return name ? this._failed[name] || [] : this._failed;
};



UnitOfWork.prototype._processQueue = function () {

if (this._failAll) {
return this._rejectAll();
}


if (this._options.maxConcurrent && this._beingResolved.length >= this._options.maxConcurrent) {
return;
}


var freeSpots = this._options.maxConcurrent ? this._options.maxConcurrent - this._beingResolved.length : -1,
endpoint,
duplicate,
entry,
x;

for (x = 0; x < this._queue.length && freeSpots; ++x) {
entry = this._queue[x];
endpoint = entry.pkg.getEndpoint();


if (this._beingResolvedEndpoints[endpoint]) {
continue;
}


this._queue.splice(x--, 1);
this.emit('dequeue', entry.pkg);



duplicate = this._findDuplicate(entry.pkg);
if (duplicate) {
entry.deferred.reject(createError('Package with same endpoint and range was already resolved', 'EDUPL', { pkg: duplicate }));
continue;
}



this._beingResolved.push(entry);
this._beingResolvedEndpoints[endpoint] = true;


freeSpots--;


this.emit('before_resolve', entry.pkg);
entry.deferred.resolve(this._onPackageDone.bind(this, entry.pkg));
}
};

UnitOfWork.prototype._rejectAll = function () {
var error,
queue;


queue = this._queue;
this._queue = [];
this._beingResolved = [];
this._beingResolvedEndpoints = {};


error = createError('Package rejected to be resolved', 'EFFAST');
queue.forEach(function (entry) {
entry.deferred.reject(error);
});
};

UnitOfWork.prototype._onPackageDone = function (pkg, err) {
var pkgName = pkg.getName(),
pkgEndpoint = pkg.getEndpoint(),
arr,
index;


if (this._completed[pkgEndpoint] && this._completed[pkgEndpoint].indexOf(pkg) !== -1) {
return;
}


arr = this._completed[pkgEndpoint] = this._completed[pkgEndpoint] || [];
arr.push(pkg);


index = this._indexOf(this._beingResolved, pkg);
this._beingResolved.splice(index, 1);
delete this._beingResolvedEndpoints[pkg.getEndpoint()];


if (!err) {
arr = this._resolved[pkgName] = this._resolved[pkgName] || [];
arr.push(pkg);
this.emit('resolve', pkg);

} else {
arr = this._failed[pkgName] = this._failed[pkgName] || [];
arr.push(pkg);
this.emit('failed', pkg);


this._failAll = this._options.failFast;
}


this._processQueue();
};

UnitOfWork.prototype._indexOf = function (arr, pkg) {
return mout.array.findIndex(arr, function (item) {
return item.pkg === pkg;
});
};

UnitOfWork.prototype._findDuplicate = function (pkg) {
var arr = this._completed[pkg.getEndpoint()];

if (!arr) {
return null;
}

return mout.array.find(arr, function (item) {
return item.getRange() === pkg.getRange();
});
};

module.exports = UnitOfWork;
