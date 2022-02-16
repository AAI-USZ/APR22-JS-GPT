


exports.jsonEncode = function(object) {
return JSON.stringify(object)
}

exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}

exports.param = function(key) {
return Express.router.params[key]
}



exports.escape = function(html) {
if (html instanceof String)
return html
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
