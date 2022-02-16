var EventEmitter = require('events').EventEmitter;
var Promise = require('bluebird');
var Readable = require('stream').Readable;
var util = require('util');

function Router(){
EventEmitter.call(this);

this.routes = {};
}

util.inherits(Router, EventEmitter);

Router.format = Router.prototype.format = function(path){
path = path || '';
if (typeof path !== 'string') throw new TypeError('path must be a string!');

path = path
.replace(/^\/+/, '')
.replace(/\\/g, '/')
.replace(/\?.*$/, '');


if (!path || path[path.length - 1] === '/'){
path += 'index.html';
}

return path;
};

Router.prototype.list = function(){
var routes = this.routes;
var keys = Object.keys(routes);
var arr = [];
var key;

for (var i = 0, len = keys.length; i < len; i++){
key = keys[i];
if (routes[key]) arr.push(key);
}

return arr;
};

Router.prototype.get = function(path){
if (typeof path !== 'string') throw new TypeError('path must be a string!');

var data = this.routes[this.format(path)];
if (!data) return;

return new RouteStream(data);
};

Router.prototype.isModified = function(path){
if (typeof path !== 'string') throw new TypeError('path must be a string!');

var data = this.routes[this.format(path)];
return data ? data.modified : false;
};

Router.prototype.set = function(path, data_){
if (typeof path !== 'string') throw new TypeError('path must be a string!');
if (data_ == null) throw new TypeError('data is required!');

var data;
path = this.format(path);

