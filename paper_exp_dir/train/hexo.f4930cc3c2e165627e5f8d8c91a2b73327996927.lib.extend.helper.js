var ExtendError = require('../error').ExtendError;



var Helper = module.exports = function(){


this.store = {};
};



Helper.prototype.list = function(){
return this.store;
};



Helper.prototype.register = function(name, fn){
if (!name) throw new ExtendError('name is required');
if (typeof fn !== 'function') throw new ExtendError('fn is required');

this.store[name] = fn;
};
