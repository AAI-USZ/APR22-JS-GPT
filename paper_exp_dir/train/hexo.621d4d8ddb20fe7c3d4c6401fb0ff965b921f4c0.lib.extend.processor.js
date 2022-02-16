var ExtendError = require('../error').ExtendError;

var rParam = /(\()?([:\*])(\w*)\)?/g;

var Processor = module.exports = function(){
this.store = [];
};

Processor.prototype.list = function(){
return this.store;
};

