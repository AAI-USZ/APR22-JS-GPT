var _ = require('lodash');
var vsprintf = require('sprintf-js').vsprintf;


function i18n(options){

this.data = {};


this.options = _.extend({
code: 'default'
}, options);

this.options.code = getCodeToken(this.options.code);
};


i18n.prototype.get = function(code){
return this.data[code];
};


i18n.prototype.set = function(code, data){
this.data[code] = data;

return this;
};


i18n.prototype.remove = function(code){
this.data[code] = null;

return this;
};

var _getProperty = function(obj, key){
if (!obj) return;

var keys = key.replace(/\[(\w+)\]/g, '.$1').split('.'),
cursor = obj;

for (var i = 0, len = keys.length; i < len; i++){
cursor = cursor[keys[i]];
if (cursor == null) return;
}

return cursor;
};

function getCodeToken(code){
var arr = [];

if (Array.isArray(code)){
code.forEach(function(item){
arr = arr.concat(getCodeToken(item));
});
} else if (code){
var split = code.split('-');

arr.push(code);

for (var i = split.length - 1; i > 0; i--){
arr.push(split.slice(0, i).join('-'));
}
}

return arr;
}


i18n.prototype._parseCode = function(code){
var arr = [].concat(getCodeToken(code), this.options.code);

if (arr.indexOf('default') === -1){
arr.push('default');
}

return _.uniq(arr);
};


i18n.prototype.__ = function(code){
var data = this.data,
langs = this._parseCode(code),
length = langs.length;

var __ =  function(){
var args = _.toArray(arguments),
key = args.shift(),
lang = args[0],
str = '';

if (!lang) {
for (var i = 0; i < length; i++){
str = _getProperty(data[langs[i]], key);
if (str) break;
}
} else {
str = _getProperty(data[lang], key);
}

if (!str || typeof str !== 'string') str = key;

return vsprintf(str, args);
};

__.languages = langs;

return __;
};


i18n.prototype._p = function(code){
var data = this.data,
langs = this._parseCode(code),
length = langs.length;

var _p = function(){
var args = _.toArray(arguments),
key = args.shift(),
number = parseInt(args[0], 10),
lang = args[1],
str = '',
plural;

if (!lang) {
for (var i = 0; i < length; i++){
plural = _getProperty(data[langs[i]], key);
if (plural) break;
}
} else {
plural = _getProperty(data[lang], key);
}

if (plural){
if (number === 0 && plural.hasOwnProperty('zero')){
str = plural.zero;
} else if (number === 1 && plural.hasOwnProperty('one')){
str = plural.one;
} else if (plural.hasOwnProperty('other')){
str = plural.other;
}
}

if (!str || typeof str !== 'string') str = key;

return vsprintf(str || key, args);
};

_p.languages = langs;

return _p;
};
