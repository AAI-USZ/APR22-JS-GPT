

(function(){
var cache = {};

var ejs = this.ejs = {};

ejs.parse = function tmpl(str, options) {
options = options || {};
options.context = options.context || {};
options.locals = options.locals || {};



var fn = cache[str] ||



new Function("obj",
"var p=[];" +


"with(obj){p.push('" +


str
.replace(/\-%>(\n|\r)/g, "%>")
.replace(/[\t\b\f]/g, " ")
.replace(/[\n\r]/g, "\f")
.split("<%").join("\t")
.replace(/((^|%>)[^\t]*)'/g, "$1\r")
.replace(/\t=(.*?)%>/g, "',$1,'")
.split("\t").join("');")
.split("%>").join("p.push('")
.split("\r").join("\\'").replace(/\f+/g, '\\n') +
"');}return p.join('');");

cache[str] = fn;


return fn.call(options.context, options.locals);
};
})();

exports.render = ejs.parse;
