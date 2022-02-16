'use strict';

const EventEmitter = require('events').EventEmitter;
const Promise = require('bluebird');
const Stream = require('stream');
const util = require('util');
const Readable = Stream.Readable;

function Router() {
EventEmitter.call(this);

this.routes = {};
}

util.inherits(Router, EventEmitter);

Router.format = Router.prototype.format = path => {
path = path || '';
if (typeof path !== 'string') throw new TypeError('path must be a string!');

path = path
.replace(/^\/+/, '')
.replace(/\\/g, '/')
.replace(/\?.*$/, '');


if (!path || path[path.length - 1] === '/') {
path += 'index.html';
}

return path;
};

Router.prototype.list = function() {
const routes = this.routes;
const keys = Object.keys(routes);
const arr = [];
let key;

for (let i = 0, len = keys.length; i < len; i++) {
key = keys[i];
if (routes[key]) arr.push(key);
}

return arr;
};

Router.prototype.get = function(path) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');

const data = this.routes[this.format(path)];
if (data == null) return;

return new RouteStream(data);
};

Router.prototype.isModified = function(path) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');

const data = this.routes[this.format(path)];
return data ? data.modified : false;
};

Router.prototype.set = function(path, data) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');
if (data == null) throw new TypeError('data is required!');

let obj;

if (typeof data === 'object' && data.data != null) {
obj = data;
} else {
obj = {
data,
modified: true
};
}

if (typeof obj.data === 'function') {
if (obj.data.length) {
obj.data = Promise.promisify(obj.data);
} else {
obj.data = Promise.method(obj.data);
}
}

path = this.format(path);

this.routes[path] = {
data: obj.data,
modified: obj.modified == null ? true : obj.modified
};

this.emit('update', path);

return this;
};

Router.prototype.remove = function(path) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');
path = this.format(path);

this.routes[path] = null;
this.emit('remove', path);

return this;
};

function RouteStream(data) {
Readable.call(this, {objectMode: true});

this._data = data.data;
this._ended = false;
this.modified = data.modified;
}

util.inherits(RouteStream, Readable);

RouteStream.prototype._read = function() {
const data = this._data;

if (typeof data !== 'function') {
this.push(data);
this.push(null);
return;
}


if (this._ended) return false;
this._ended = true;

data().then(data => {
if (data instanceof Stream && data.readable) {
data.on('data', d => {
this.push(d);
});

data.on('end', () => {
this.push(null);
});

