var ExtendError = require('../error').ExtendError,
types = require('swig/lib/lexer').types;



var Tag = module.exports = function(){


this.store = [];
};



Tag.prototype.list = function(){
return this.store;
