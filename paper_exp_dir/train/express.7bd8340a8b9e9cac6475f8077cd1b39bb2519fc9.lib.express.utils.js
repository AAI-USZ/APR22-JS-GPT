




var queryString = require('querystring')



JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.uid = function() {
var uid = ''
for (var n = 4; n; --n)
uid += (Math.abs((Math.random() * 0xFFFFFFF) | 0)).toString(16)
return uid
}



exports.extname = function(path) {
if (path.lastIndexOf('.') < 0) return
return path.slice(path.lastIndexOf('.') + 1)
}



exports.basename = function(path) {
return path.split('/').slice(-1)[0]
}



exports.escape = function(html) {
return html.toString()
.replace(/&/g, '&amp;')
.replace(/"/g, '&quot;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
}



exports.toArray = function(arr, offset) {
return Array.prototype.slice.call(arr, offset)
}



exports.escapeRegexp = function(string, chars) {
var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
}



exports.mergeParam = function(key, val, params) {
var orig = params,
keys = key.trim().match(/\w+/g),
array = /\[\]$/.test(key)
$(keys).reduce(queryString.parseQuery(key), function(parts, key, i){
if (i === keys.length - 1)
if (key in params)
params[key] instanceof Array ?
params[key].push(val) :
params[key] = [params[key], val]
else
params[key] = array ? [val] : val
if (!(key in params)) params[key] = {}
params = params[key]
return parts[key]
})
return orig
}
