


process.mixin(require('sys'))
process.mixin(require('express/exceptions'))
process.mixin(require('express/helpers'))
process.mixin(require('express/mime'))
process.mixin(require('express/dsl'))



Route = Class({



init: function(method, path, fn, options){
this.method = method
this.originalPath = path
this.path = this.normalize(normalizePath(path))
this.fn = fn
},



run: function(){
return this.fn()
},



normalize: function(path) {
