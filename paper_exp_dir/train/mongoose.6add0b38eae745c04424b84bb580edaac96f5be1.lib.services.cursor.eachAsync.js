'use strict';



var async = require('async');
var utils = require('../../utils');



module.exports = function eachAsync(next, fn, options, callback) {
var parallel = options.parallel || 1;

var handleNextResult = function(doc, callback) {
var promise = fn(doc);
if (promise && typeof promise.then === 'function') {
promise.then(
function() { callback(null); },
function(error) { callback(error || new Error('`eachAsync()` promise rejected without error')); });
} else {
callback(null);
}
};

var iterate = function(callback) {
var drained = false;
var nextQueue = async.queue(function(task, cb) {
if (drained) return cb();
next(function(err, doc) {
if (err) return cb(err);
if (!doc) drained = true;
cb(null, doc);
});
}, 1);

var getAndRun = function(cb) {
nextQueue.push({}, function(err, doc) {
if (err) return cb(err);
if (!doc) return cb();
handleNextResult(doc, function(err) {
if (err) return cb(err);

setTimeout(function() {
getAndRun(cb);
}, 0);
});
});
};

async.times(parallel, function(n, cb) {
getAndRun(cb);
}, callback);
};

return utils.promiseOrCallback(callback, cb => {
iterate(cb);
});
};
