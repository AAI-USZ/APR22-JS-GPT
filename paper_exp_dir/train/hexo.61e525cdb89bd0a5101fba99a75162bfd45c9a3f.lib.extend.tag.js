var ExtendError = require('../error').ExtendError;



var Tag = module.exports = function(){


this.store = [];
};



Tag.prototype.list = function(){
return this.store;
};



Tag.prototype.register = function(name, fn, ends){
if (typeof fn !== 'function'){
throw new ExtendError('Tag function is not defined');
}

var tag = {
name: name,
ends: ends
};

tag.parse = function(str, line, parser, types, options){
return true;
};

