




var path = require('path'),
fs = require('fs')



fs.readFile = function(path, encoding, callback) {
if (encoding instanceof Function)
callback = encoding,
encoding = null
try {
callback(null, fs.readFileSync(path, encoding))
} catch (e) {
callback(e)
}
}



path.exists = function(path, callback) {
try {
fs.statSync(path)
callback(true)
} catch (e) {
callback(false)
}
}



fs.stat = function(path, callback) {
try {
callback(null, fs.statSync(path))
} catch (e) {
callback(e)
