




var View = require('./view')
, basename = require('path').basename;



var cache = {};



var Partial = exports = module.exports = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
this.path = this.resolvePartialPath();
};



Partial.prototype.__proto__ = View.prototype;



Partial.prototype.resolvePartialPath = function(){
return this.dirname + '/_' + basename(this.path);
};



exports.resolveObjectName = function(view){
return cache[view] || (cache[view] = view
.split('/')
