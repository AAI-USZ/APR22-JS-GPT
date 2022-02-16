var stripIndent = require('strip-indent');
var swig = require('swig');

function Tag(){
this.swig = new swig.Swig({
autoescape: false
});
}

Tag.prototype.register = function(name, fn, options){
if (!name) throw new TypeError('name is required');
if (typeof fn !== 'function') throw new TypeError('fn must be a function');

