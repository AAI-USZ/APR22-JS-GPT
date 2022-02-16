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
