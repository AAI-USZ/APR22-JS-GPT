
var rParam = /([:\*])([\w\?]*)?/g;


function Pattern(rule){
if (typeof rule === 'function'){
this.filter = rule;
} else if (rule instanceof RegExp){
this.filter = regexFilter(rule);
} else {
this.filter = stringFilter(rule);
}
}


Pattern.prototype.match = function(str){
return this.filter(str);
};

function regexFilter(rule){
return function(str){
return str.match(rule);
};
}

function stringFilter(rule){
var params = [];

var regex = escape.regex(rule)
.replace(/\\([\*\?])/g, '$1')
.replace(rParam, function(match, operator, name){
var str = '';
var optional = false;

if (operator === '*'){
str = '(.*)?';
} else {
str = '([^\\/]+)';
}

if (name){
if (name[name.length - 1] === '?'){
name = name.slice(0, name.length - 1);
optional = true;
str += '?';
}

params.push(name);
}

return str;
});

return function(str){
var match = str.match(regex);
if (!match) return;

var result = {};
var name;

for (var i = 0, len = match.length; i < len; i++){
name = params[i - 1];
result[i] = match[i];
if (name) result[name] = match[i];
}

return result;
};
}

module.exports = Pattern;
