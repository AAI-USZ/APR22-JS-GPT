var ExtendError = require('../error').ExtendError;



var Generator = module.exports = function(){


this.store = [];
};



Generator.prototype.list = function(){
return this.store;
};
