var ExtendError = require('../error').ExtendError,
pathFn = require('path'),
domain = require('domain');



var Renderer = module.exports = function(){


this.store = {};



this.storeSync = {};
};



Renderer.prototype.list = function(sync){
return sync ? this.storeSync : this.store;
};



Renderer.prototype.register = function(name, output, fn, sync){
if (!name) throw new ExtendError('name is required');
if (!output) throw new ExtendError('output is required');
if (typeof fn !== 'function') throw new ExtendError('fn is required');

name = name.replace(/^\./, '');
output = output.replace(/^\./, '');

if (sync){
this.storeSync[name] = fn;
this.storeSync[name].output = output;

this.store[name] = function(){
var args = Array.prototype.slice.call(arguments),
callback = args.pop(),
d = domain.create(),
