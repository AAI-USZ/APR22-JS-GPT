




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



sendfile: function(path, options) {
if (path.indexOf('..') !== -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
this.response.chunkedEncoding = true
return this.stream(fs.createReadStream(path, options))
},



download: function(file, filename) {
return this.attachment(filename || path.basename(file)).sendfile(file)
}
})
}
}
})
