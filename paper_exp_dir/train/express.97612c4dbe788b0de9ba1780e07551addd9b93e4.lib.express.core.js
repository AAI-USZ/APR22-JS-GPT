


process.mixin(require('sys'))



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = pathToRegexp(normalizePath(path))
print(this.path)
this.fn = fn
},
run: function(){
return process
.compile('with(Express.helpers){ (' + this.fn + ')() }',
this.method + '(' + jsonEncode(this.originalPath) + ')')
}
})



var captures = [],
params = {}

