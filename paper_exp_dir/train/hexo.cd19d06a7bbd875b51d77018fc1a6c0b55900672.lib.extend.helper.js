var ExtendError = require('../error').ExtendError;



var Helper = module.exports = function(){


this.store = {};
};



Helper.prototype.list = function(){
return this.store;
};
