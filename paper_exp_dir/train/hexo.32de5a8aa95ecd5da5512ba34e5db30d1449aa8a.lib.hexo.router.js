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
