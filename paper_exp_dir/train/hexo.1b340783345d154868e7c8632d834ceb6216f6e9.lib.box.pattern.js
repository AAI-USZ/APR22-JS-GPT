var util = require('../util');
var escape = util.escape;

var rParam = /([:\*])([\w\?]*)?/g;


function Pattern(rule){
if (typeof rule === 'function'){
this.match = rule;
} else if (rule instanceof RegExp){
this.match = regexFilter(rule);
} else {
this.match = stringFilter(rule);
}
}


Pattern.prototype.match;

function regexFilter(rule){
return function(str){
return str.match(rule);
};
}
