




var Request = require('express/request').Request



exports.parseCookie = function(cookie) {
return cookie.replace(/^ *| *$/g, '').split(/ *; */).reduce(function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0]] = parts[1]
return hash
}, {})
}



exports.compileCookie = function(name, val, options) {
if (!options) return name + '=' + val
var val,
buf = [name + '=' + val],
keys = Object.keys(options)
for (var i = 0, len = keys.length; i < len; ++i) {
val = options[keys[i]]
if (val instanceof Date)
val = val.toGMTString()
buf.push(val === true
? keys[i]
: keys[i] + '=' + val)
