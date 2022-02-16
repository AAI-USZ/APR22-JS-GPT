




var Request = require('express/request').Request,
path = require('path'),
fs = require('fs')



exports.Static = Plugin.extend({
extend: {



init: function(options) {
options = options || {}
options.path = options.path || set('root') + '/public'



get('/public/*', function(file){
this.sendfile(options.path + '/' + file)
})



Request.include({



sendfile: function(path, options, callback) {
var self = this
if (options instanceof Function)
callback = options,
options = {}
if (path.indexOf('..') !== -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
this.response.chunkedEncoding = true
fs.stat(path, function(err, stat){
if (err)
if (callback !== undefined)
return callback(err)
else
return 'errno' in err && err.errno === 2
? self.notFound()
: self.error(err)
var etag = stat.ino + '-' + stat.size + '-' + Number(stat.mtime)
if (self.header('if-none-match') &&
self.header('if-none-match') == etag)
return self.halt(304)

self.header('etag', etag)
self.stream(fs.createReadStream(path, options))
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
