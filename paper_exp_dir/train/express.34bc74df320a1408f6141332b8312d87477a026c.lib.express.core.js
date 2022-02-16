


process.mixin(require('sys'))



ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
})



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = pathToRegexp(normalizePath(path))
this.fn = fn
},
run: function(){
return this.fn()
}
})



NotFoundError = ExpressError.extend({
name: 'NotFoundError',
init: function(request) {
this.message = 'failed to find ' + request.method + ' ' + jsonEncode(request.uri.path)
}
