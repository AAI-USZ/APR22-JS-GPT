var _ = require('lodash'),
ExtendError = require('../error').ExtendError;

var placeholder = String.fromCharCode(65535),
rPlaceholder = new RegExp(placeholder + '(\\d+)' + placeholder, 'g');



var Tag = module.exports = function(){

this.store = [];
};



Tag.prototype.list = function(){
return this.store;
};



Tag.prototype.register = function(name, fn, options){
if (typeof name === 'undefined'){
throw new ExtendError('Tag name is not defined');
