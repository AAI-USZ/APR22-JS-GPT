




var View = require('./view')
, basename = require('path').basename;



var cache = {};



var Partial = exports = module.exports = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
this.path = this.resolvePartialPath(this.dirname);
};



Partial.prototype.__proto__ = View.prototype;



Partial.prototype.resolvePartialPath = function(dir){
return dir + '/_' + basename(this.path);
};



exports.resolveObjectName = function(view){
return cache[view] || (cache[view] = view
.split('/')
.slice(-1)[0]
.split('.')[0]
.replace(/[^a-zA-Z0-9 ]+/g, ' ')
.split(/ +/).map(function(word, i){
return i
? word[0].toUpperCase() + word.substr(1)
: word;
}).join(''));
};
