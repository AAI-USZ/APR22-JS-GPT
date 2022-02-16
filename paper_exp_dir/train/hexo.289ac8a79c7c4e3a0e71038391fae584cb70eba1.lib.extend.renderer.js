var ExtendError = require('../error').ExtendError,
pathFn = require('path');



var Renderer = module.exports = function(){


this.store = {};



this.storeSync = {};
};



Renderer.prototype.list = function(sync){
return sync ? this.storeSync : this.store;
};



Renderer.prototype.register = function(name, output, fn, sync){
if (typeof name === 'undefined'){
throw new ExtendError('Renderer name is not defined');
}

if (typeof name === 'undefined'){
throw new ExtendError('Renderer output is not defined');
}

if (typeof fn !== 'function'){
throw new ExtendError('Renderer function is not defined');
}

