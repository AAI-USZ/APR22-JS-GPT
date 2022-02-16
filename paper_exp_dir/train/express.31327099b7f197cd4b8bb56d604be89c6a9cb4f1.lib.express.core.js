


process.mixin(require('sys'))



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.path = pathToRegexp(normalizePath(path))
this.fn = fn
},
run: function(){
return process.compile('with(Express.helpers){ (' + this.fn + ')() }', this.method + '(' + this.path + ')')
}
})



Router = Class({
captures: [],
route: function(request){
this.request = request
return this.matchingRoute().run()
},

matchingRoute: function(){
for (var i = 0, len = Express.routes.length; i < len; ++i)
