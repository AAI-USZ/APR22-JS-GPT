var ExtendError = require('../error').ExtendError;

var Console = module.exports = function(){
this.store = {};
this.alias = {};
};

Console.prototype.get = function(name){
name = name.toLowerCase();

return this.store[name] || this.alias[name];
};

Console.prototype.list = function(){
return this.store;
};

