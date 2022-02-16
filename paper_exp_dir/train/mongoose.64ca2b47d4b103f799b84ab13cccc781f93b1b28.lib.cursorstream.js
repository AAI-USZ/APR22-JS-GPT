


var Stream = require('stream').Stream
var utils = require('./utils')




function CursorStream (query) {
Stream.call(this);

this.query = query;
this.readable = true;
this._cursor = null;
this._destroyed = null;


var self = this;
process.nextTick(function () {
self._init();
});
}



CursorStream.prototype.__proto__ = Stream.prototype;



CursorStream.prototype._init = function () {
var query = this.query
, model = query.model
, options = query._optionsForExec(model)
, self = this

try {
query.cast(model);
} catch (err) {
return self.destroy(err);
}

self._fields = utils.clone(options.fields = query._fields);

model.collection.find(query._conditions, options, function (err, cursor) {
if (err) return self.destroy(err);
self._cursor = cursor;
self._next();
});
}



CursorStream.prototype._next = function () {
if (this._paused || this._destroyed) return;

var self = this;



process.nextTick(function () {
self._cursor.nextObject(function (err, doc) {
self._onNextObject(err, doc);
});
});
}



CursorStream.prototype._onNextObject = function (err, doc) {
if (err) return this.destroy(err);


if (!doc) {
return this.destroy();
}

var instance = new this.query.model(undefined, this._fields);


delete instance._doc._id;

var self = this;
instance.init(doc, this.query, function (err) {
if (err) return self.destroy(err);
self.emit('data', instance);
self._next();
});
}



CursorStream.prototype.pause = function () {
this._paused = true;
}



CursorStream.prototype.resume = function () {
this._paused = false;
this._next();
}



CursorStream.prototype.destroy = function (err) {
if (this._destroyed) return;
this._destroyed = true;
this.readable = false;

if (this._cursor) {
this._cursor.close();
}

if (err) {
this.emit('error', err);
}

this.emit('close');
}






module.exports = exports = CursorStream;
