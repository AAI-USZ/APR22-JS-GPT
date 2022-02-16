


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
var file = this.path
path.exists(file, function(exists){
if (!exists) request.halt()
posix.stat(file).addCallback(function(stats){
if (!stats.isFile()) request.halt()
request.contentType(file)
