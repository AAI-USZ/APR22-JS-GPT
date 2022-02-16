




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
