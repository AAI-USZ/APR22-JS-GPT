


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/helpers'))
process.mixin(require('express/mime'))
process.mixin(require('express/dsl'))





function normalizePath(path) {
return path.replace(/[\s\/]*$/g, '')
}



Route = Class({



keys: [],



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(path)
this.fn = fn
},



run: function(){
return this.fn()
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' +
escapeRegexp(normalizePath(path)
.replace(/\/:(\w+)\?/g, function(_, key){
self.keys.push(key)
return '(?:\/(.*?))?'
})
.replace(/:(\w+)/g, function(_, key){
self.keys.push(key)
return '(.*?)'
}), '/ [ ]') + '$', 'i')
}
})



Router = Class({



params: {},



captures: [],



route: function(request){
this.request = request
return this.matchingRoute().run()
},



matchingRoute: function(){
for (var i = 0, len = Express.routes.length; i < len; ++i)
if (this.match(Express.routes[i]))
return Express.routes[i]
throw new NotFoundError(this.request)
},



match: function(route) {
if (this.request.method.toLowerCase() == route.method)
if (this.captures = this.request.uri.path.match(route.path)) {
this.mapParams(route)
return true
}
},



mapParams: function(route) {
for (var i = 0, len = route.keys.length; i < len; ++i)
this.params[route.keys[i]] = this.captures[i+1]
}
})



Server = Class({



port: 3000,



host: 'localhost',


