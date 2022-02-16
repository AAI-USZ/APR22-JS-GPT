var rParam = /(\()?([:\*])(\w*)\)?/g;

var Pattern = module.exports = function Pattern(rule){
if (typeof rule === 'function'){
this.filter = rule;
} else if (rule instanceof RegExp){
this.rule = rule;
this.params = [];
} else {
var params = [];

var regex = rule.replace(/(\/|\.)/g, '\\$&')
.replace(rParam, function(match, optional, operator, name){
