




var Request = require('express/request').Request,
path = require('path'),
fs = require('fs')



exports.Static = Plugin.extend({
extend: {



init: function(config) {
config = config || {}
config.path = config.path || set('root') + '/public'



get('/public/*', function(file){
this.sendfile(config.path + '/' + file)
})



Request.include({



sendfile: function(path, options, callback) {
var self = this
if (options instanceof Function)
callback = options,
options = {}
else
options = options || {}
if (path.indexOf('..') !== -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
fs.stat(path, function(err, stat){
if (err)
return 'errno' in err && err.errno === 2
? self.notFound()
: self.error(err, callback)
var etag = Number(stat.mtime)
if (self.header('If-None-Match') &&
self.header('If-None-Match') == etag)
return self.respond(304, null)
self.header('Content-Length', stat.size)
self.header('ETag', etag)
options.bufferSize = options.bufferSize
|| config.bufferSize
|| 65536
if (stat.size > options.bufferSize)
return self.stream(fs.createReadStream(path, options))
fs.readFile(path, function(err, content){
if (err) return self.error(err, callback)
self.contentType(path)
self.respond(200, content)
})
})
return this
},



download: function(file, filename) {
return this.attachment(filename || path.basename(file)).sendfile(file)
}
})
}
}
})
