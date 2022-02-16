'use strict';

const { EventEmitter } = require('events');
const Promise = require('bluebird');
const Stream = require('stream');
const util = require('util');
const { Readable } = Stream;

function Router() {
Reflect.apply(EventEmitter, this, []);

this.routes = {};
}

util.inherits(Router, EventEmitter);

const format = path => {
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

Router.format = format;
Router.prototype.format = format;

Router.prototype.list = function() {
const { routes } = this;
return Object.keys(routes).filter(key => routes[key]);
};

Router.prototype.get = function(path) {
if (typeof path !== 'string') throw new TypeError('path must be a string!');
