var swig = require('swig'),
forTag = require('swig/lib/tags/for');

swig.setDefaults({
cache: false
});


swig.setTag('for', forTag.parse, function(compiler, args, content, parents, options, blockName){
var compile = forTag.compile.apply(this, arguments).split('\n');
