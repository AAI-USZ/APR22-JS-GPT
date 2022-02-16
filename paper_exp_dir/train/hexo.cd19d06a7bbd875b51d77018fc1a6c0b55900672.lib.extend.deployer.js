var ExtendError = require('../error').ExtendError;



var Deployer = module.exports = function(){


this.store = {};
};



Deployer.prototype.list = function(){
return this.store;
};
