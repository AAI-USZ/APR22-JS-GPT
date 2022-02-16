




var queryString = require('querystring')



JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.uid = function() {
var uid = ''
for (var n = 4; n; --n)
uid += (Math.abs((Math.random() * 0xFFFFFFF) | 0)).toString(16)
return uid
}



exports.escape = function(html) {
return String(html)
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
}



exports.mergeParam = function(key, val, params) {
var orig = params,
keys = key.trim().match(/\w+/g),
array = /\[\]$/.test(key)
keys.reduce(function(parts, key, i){
if (i === keys.length - 1)
if (key in params)
params[key] instanceof Array
? params[key].push(val)
: params[key] = [params[key], val]
else
params[key] = array ? [val] : val
if (!(key in params)) params[key] = {}
params = params[key]
return parts[key]
}, queryString.parse(key))
return orig
}
