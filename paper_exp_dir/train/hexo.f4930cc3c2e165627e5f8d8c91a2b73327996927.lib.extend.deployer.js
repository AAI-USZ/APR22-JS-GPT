var ExtendError = require('../error').ExtendError;



var Deployer = module.exports = function(){


this.store = {};
};



Deployer.prototype.list = function(){
return this.store;
};



Deployer.prototype.register = function(name, fn){
if (!name) throw new ExtendError('name is required');
if (typeof fn !== 'function') throw new ExtendError('fn is required');

this.store[name] = fn;
};
