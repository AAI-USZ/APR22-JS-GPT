var ExtendError = require('../error').ExtendError;



var Swig = module.exports = function(){


this.store = {};
};



Swig.prototype.list = function(){
return this.store;
};
