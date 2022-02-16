var _ = require('lodash'),
vsprintf = require('sprintf-js').vsprintf;


var i18n = module.exports = function i18n(options){

this.data = {};


this.options = _.extend({
code: 'default'
}, options);

this.options.code = _getCodeToken(this.options.code);
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

var _getCodeToken = function(code){
var arr = [];

if (Array.isArray(code)){
code.forEach(function(item){
arr = arr.concat(_getCodeToken(item));
});
} else if (code){
var split = code.split('-');

arr.push(code);

for (var i = split.length - 1; i > 0; i--){
arr.push(split.slice(0, i).join('-'));
}
}

return arr;
};


i18n.prototype._parseCode = function(code){
var arr = [].concat(_getCodeToken(code), this.options.code);

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
