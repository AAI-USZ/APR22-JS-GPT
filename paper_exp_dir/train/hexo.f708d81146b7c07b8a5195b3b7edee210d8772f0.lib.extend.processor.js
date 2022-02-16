var ExtendError = require('../error').ExtendError;

var rParam = /(\()?([:\*])(\w*)\)?/g;

var Processor = module.exports = function(){
this.store = [];
};

Processor.prototype.list = function(){
return this.store;
};

var format = Processor.prototype.format = function(rule){
var params = [];

var regex = rule.replace(/(\/|\.)/g, '\\$&')
.replace(rParam, function(match, optional, operator, name){
params.push(name);

if (operator === '*'){
var str = '(.*?)'
} else {
