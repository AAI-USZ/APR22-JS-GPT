var ExtendError = require('../error').ExtendError;

var Console = module.exports = function(){
this.store = {};
this.alias = {};
};

Console.prototype.list = function(){
return this.store;
};

Console.prototype.register = function(name, desc, options, fn){
if (!fn){
if (typeof options === 'function'){
