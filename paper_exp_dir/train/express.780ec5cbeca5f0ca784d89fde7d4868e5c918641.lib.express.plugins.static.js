




var path = require('path'),
fs = require('fs')



exports.File = new Class({



constructor: function(path) {
this.path = path
if (path.indexOf('..') != -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
},



sendTo: function(request) {
var cache, file = this.path
if (set('cache static files') && (cache = request.cache.get(file)))
return request.contentType(cache.type),
request.halt(200, cache.content, 'binary')
path.exists(file, function(exists){
if (!exists) return request.halt()
fs.stat(file, function(err, stats){
if (err) throw err
if (!stats.isFile()) return request.halt()
fs.readFile(file, 'binary', function(err, content){
if (err) throw err
request.contentType(file)
if (set('cache static files'))
request.cache.set(file, { type: file, content: content })
request.halt(200, content, 'binary')
})
})
})
}
})



exports.Static = Plugin.extend({
extend: {



init: function(options) {
options = options || {}
options.path = options.path || set('root') + '/public'



get('/public/*', function(file){
this.sendfile(options.path + '/' + file)
})



Request.include({



sendfile: function(path) {
(new exports.File(path)).sendTo(this)
return this
}
})
}
}
})
