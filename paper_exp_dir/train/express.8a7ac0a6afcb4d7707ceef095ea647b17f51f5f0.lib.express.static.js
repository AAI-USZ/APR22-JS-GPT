


var path = require('path'),
posix = require('posix')



InvalidPathError = ExpressError.extend({
name: 'InvalidPathError',
init: function(path) {
this.message = "`" + path + "' is not a valid path"
}
})



exports.File = Class({



init: function(path) {
this.path = path
if (path.indexOf('..') != -1) throw new InvalidPathError(path)
},



send: function(request) {
var cache, file = this.path
if (set('cache static files') && (cache = request.cache.get(file)))
return request.contentType(cache.type),
request.halt(200, cache.content, 'binary')
path.exists(file, function(exists){
if (!exists) return request.halt()
posix.stat(file).addCallback(function(stats){
if (!stats.isFile()) return request.halt()
posix.cat(file, 'binary').addCallback(function(content){
request.contentType(file)
if (set('cache static files'))
request.cache.set(file, { type: file, content: content })
request.halt(200, content, 'binary')
})
})
})
}
})
