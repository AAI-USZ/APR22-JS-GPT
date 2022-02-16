var ExtendError = require('../error').ExtendError;



var Tag = module.exports = function(){


this.store = {};
};



Tag.prototype.list = function(){
return this.store;
};
