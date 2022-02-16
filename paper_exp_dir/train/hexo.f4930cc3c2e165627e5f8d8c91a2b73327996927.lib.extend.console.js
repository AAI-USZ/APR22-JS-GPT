var _ = require('lodash'),
ExtendError = require('../error').ExtendError;



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



Console.prototype.register = function(name, desc, options, fn){
if (!name) throw new ExtendError('name is required');

if (!fn){
if (options){
if (typeof options === 'function'){
fn = options;

if (_.isObject(desc)){
options = desc;
desc = '';
