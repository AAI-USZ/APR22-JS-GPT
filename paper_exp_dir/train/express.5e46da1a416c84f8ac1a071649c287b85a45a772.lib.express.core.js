


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



run: function(){
return this.fn()
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
