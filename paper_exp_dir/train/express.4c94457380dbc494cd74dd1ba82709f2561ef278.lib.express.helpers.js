




JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
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
var keys = key.match(/(\w+)/g),
orig = params
for (var i = 0, len = keys.length; i < len; ++i)
if (i == len - 1)
params[keys[i]] = val
else
params = (params[keys[i]] = params[keys[i]] || {})
return orig
}
