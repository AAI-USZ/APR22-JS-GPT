




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



function decode(params) {
for (var key in params)
params[key] = decodeURIComponent(params[key]).replace(/\+/g, ' ')
}



exports.parseNestedParams = function(params) {
var parts, key
decode(params)
for (key in params)
if (parts = key.split('['))
if (parts.length > 1)
for (var i = 0, prop = params, len = parts.length; i < len; ++i) {
var name = parts[i].replace(']', '')
if (i == len - 1)
prop[name] = params[key],
prop = params,
delete params[key]
else
prop = prop[name] = prop[name] || {}
}
return params
}



exports.parseParams = function(str) {
if (typeof str !== 'string') return
return exports.parseNestedParams($(str.split('&')).reduce({}, function(params, pair){
pair = pair.split('=')
params[pair[0]] = pair[1]
return params
}))
