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
}

if (typeof fn !== 'function'){
throw new ExtendError('Tag function is not defined');
}

if (typeof options === 'boolean'){
options = {ends: options};
}

options = _.extend({
ends: false,
escape: true
}, options);

var tag = {
name: name,
ends: options.ends
};

tag.parse = function(str, line, parser, types, stack, opts){

parser.on('*', function(token){
var prevToken = this.prevToken,
prevTokenType = prevToken ? prevToken.type : 0,
isString = true;

switch (token.type){
case types.WHITESPACE:
for (var i = 0, len = token.length; i < len; i++){
this.out.push(' ');
}

