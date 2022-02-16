var util = require('../util');
var escape = util.escape;

var rParam = /([:\*])([\w\?]*)?/g;


function Pattern(rule){
if (rule instanceof Pattern){
return rule;
} else if (typeof rule === 'function'){
this.match = rule;
} else if (rule instanceof RegExp){
this.match = regexFilter(rule);
} else if (typeof rule === 'string'){
this.match = stringFilter(rule);
} else {
throw new TypeError('rule must be a function, a string or a regular expression.');
