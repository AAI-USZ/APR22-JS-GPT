




var path = require('path'),
fs = require('fs')



exports.File = new NewClass({



constructor: function(path) {
this.path = path
if (path.indexOf('..') != -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
},



send: function(request) {
var cache, file = this.path
if (set('cache static files') && (cache = request.cache.get(file)))
return request.contentType(cache.type),
request.halt(200, cache.content, 'binary')
path.exists(file, function(exists){
if (!exists) return request.halt()
fs.stat(file, function(e, stats){
if (e) throw e
if (!stats.isFile()) return request.halt()
fs.readFile(file, 'binary', function(e, content){
if (e) throw e
request.contentType(file)
if (set('cache static files'))
request.cache.set(file, { type: file, content: content })
request.halt(200, content, 'binary')
})
})
})
}
})
