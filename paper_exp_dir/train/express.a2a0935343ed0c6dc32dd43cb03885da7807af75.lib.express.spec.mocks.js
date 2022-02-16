




var Request = require('express/request').Request,
path = require('path'),
fs = require('fs')



fs.readFile = function(path, encoding, callback) {
if (encoding instanceof Function)
callback = encoding,
encoding = null
try {
callback(null, fs.readFileSync(path, encoding))
