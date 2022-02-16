var util = require('../util'),
escape = util.escape;

var rParam = /(\()?([:\*])(\w*)\)?/g;


var Pattern = module.exports = function Pattern(rule){
if (typeof rule === 'function'){
this.filter = rule;
} else if (rule instanceof RegExp){
this.rule = rule;
