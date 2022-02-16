




var View = require('./view')
, basename = require('path').basename;



var cache = {};



var Partial = exports = module.exports = function Partial(view, options) {
options = options || {};
View.call(this, view, options);
};



Partial.prototype.__proto__ = View.prototype;



exports.resolveObjectName = function(view){
return cache[view] || (cache[view] = view
.split('/')
.slice(-1)[0]
.split('.')[0]
.replace(/[^a-zA-Z0-9 ]+/g, ' ')
