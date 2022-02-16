




var path = require('path'),
fs = require('fs')



fs.readFile = function(path, encoding, fn) {
if (encoding instanceof Function)
fn = encoding,
encoding = null
try {
fn(null, fs.readFileSync(path, encoding))
} catch (e) {
