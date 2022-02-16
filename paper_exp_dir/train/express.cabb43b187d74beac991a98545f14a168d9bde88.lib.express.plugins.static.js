




var path = require('path'),
fs = require('fs')



exports.File = new Class({



constructor: function(path) {
this.path = path
if (path.indexOf('..') != -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
},



sendTo: function(request) {
var file = this.path
function sendFromDisc() {
path.exists(file, function(exists){
if (!exists) return request.halt()
fs.stat(file, function(err, stats){
if (err) throw err
if (!stats.isFile()) return request.halt()
fs.readFile(file, 'binary', function(err, content){
if (err) throw err
request.contentType(file)
