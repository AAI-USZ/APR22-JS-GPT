var rParam = /(\()?([:\*])(\w*)\)?/g;

var Pattern = module.exports = function Pattern(rule){
if (rule instanceof RegExp){
this.rule = rule;
this.params = [];
} else {
var params = [];

var regex = rule.replace(/(\/|\.)/g, '\\$&')
.replace(rParam, function(match, optional, operator, name){
params.push(name);

var str = '';

if (operator === '*'){
str = '(.*?)';
} else {
str = '([^\\/]+)';
