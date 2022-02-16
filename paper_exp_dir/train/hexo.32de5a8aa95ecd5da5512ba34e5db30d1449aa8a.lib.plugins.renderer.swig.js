var swig = require('swig');
var forTag = require('swig/lib/tags/for');

swig.setDefaults({
cache: false
});


swig.setTag('for', forTag.parse, function(compiler, args, content, parents, options, blockName){
var compile = forTag.compile.apply(this, arguments).split('\n');

compile.splice(3, 0, '  if (!Array.isArray(__l) && typeof __l.toArray === "function") { __l = __l.toArray(); }');

return compile.join('\n');
}, forTag.ends, true);

function swigRenderer(data, locals){
return swig.render(data.text, {
locals: locals,
filename: data.path
});
}
