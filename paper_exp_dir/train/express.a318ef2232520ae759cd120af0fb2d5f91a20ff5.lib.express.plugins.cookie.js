




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
return name + '=' + val + '; ' + options.map(function(val, key){
if (val instanceof Date)
val = val.toGMTString()
return val === true ? key : key + '=' + val
}).join('; ')
}



exports.Cookie = Plugin.extend({
extend: {


