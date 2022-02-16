




var utils = require('express/utils'),
fs = require('fs')



fs.readFile = function(path, fn) {
try {
fn(null, fs.readFileSync(path))
} catch (e) {
fn(e)
}
}
