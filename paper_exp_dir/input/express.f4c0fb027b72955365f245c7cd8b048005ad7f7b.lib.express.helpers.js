


exports.jsonEncode = function(object) {
return JSON.stringify(object)
}

exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}

exports.param = function(key) {
return Express.server.router.params[key]
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
