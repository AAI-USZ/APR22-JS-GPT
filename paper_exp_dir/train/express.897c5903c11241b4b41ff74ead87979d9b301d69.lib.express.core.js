


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/collection'))
process.mixin(require('express/helpers'))
process.mixin(require('express/plugin'))
process.mixin(require('express/mime'))
process.mixin(require('express/view'))
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



run: function(args) {
return this.fn.apply(GLOBAL, args)
},



normalize: function(path) {
var self = this
this.keys = []
if (path instanceof RegExp) return path
return new RegExp('^' + normalizePath(path)
.replace(/\/:(\w+)\?/g, function(_, key){
self.keys.push(key)
return '(?:\/([^\/]+))?'
})
.replace(/:(\w+)/g, function(_, key){
self.keys.push(key)
return '([^\/]+)'
}) + '$', 'i')
}
})



Router = Class({



params: {},



captures: [],



route: function(request){
this.request = request
var route = this.matchingRoute()
if (route)
return route.run(this.captures.slice(1))
else if (accepts('html') && set('helpful 404'))
halt(404, require('express/pages/not-found').render())
else
halt()
},



