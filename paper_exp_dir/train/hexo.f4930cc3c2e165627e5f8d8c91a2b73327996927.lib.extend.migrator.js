var ExtendError = require('../error').ExtendError;



var Migrator = module.exports = function(){


this.store = {};
};



Migrator.prototype.list = function(){
return this.store;
};



Migrator.prototype.register = function(name, fn){
if (!name) throw new ExtendError('name is required');
if (typeof fn !== 'function') throw new ExtendError('fn is required');

this.store[name] = fn;
};
