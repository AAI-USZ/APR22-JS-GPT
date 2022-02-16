var util = require('../util'),
escape = util.escape;



if (typeof rule === 'function'){
this.filter = rule;
} else if (rule instanceof RegExp){
