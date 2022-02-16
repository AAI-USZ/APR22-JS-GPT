




var Request = require('express/request').Request,
path = require('path'),
fs = require('fs')



exports.File = new Class({



constructor: function(path) {
this.path = path
if (path.indexOf('..') !== -1)
Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
},



sendTo: function(request) {









