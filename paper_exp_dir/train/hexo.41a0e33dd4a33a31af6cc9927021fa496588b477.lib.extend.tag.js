var ExtendError = require('../error').ExtendError,
types = require('swig/lib/lexer').types;



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

parser.on('*', function(token){
switch (token.type){
case types.WHITESPACE:
this.out.push(' ');
break;

case types.DOTKEY:
this.out.push('.');
break;

case types.FILTER:
case types.FILTEREMPTY:
