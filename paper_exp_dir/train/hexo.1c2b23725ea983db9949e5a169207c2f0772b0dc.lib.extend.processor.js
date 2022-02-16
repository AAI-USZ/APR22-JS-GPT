var ExtendError = require('../error').ExtendError,
Pattern = require('../box/pattern');



var Processor = module.exports = function(){


this.store = [];
};



Processor.prototype.list = function(){
return this.store;
