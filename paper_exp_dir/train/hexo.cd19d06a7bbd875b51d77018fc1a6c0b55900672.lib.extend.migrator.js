var ExtendError = require('../error').ExtendError;



var Migrator = module.exports = function(){


this.store = {};
};



Migrator.prototype.list = function(){
return this.store;
};
