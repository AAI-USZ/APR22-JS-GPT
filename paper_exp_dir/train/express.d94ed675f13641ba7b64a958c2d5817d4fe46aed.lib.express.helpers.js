




JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}



exports.extname = function(path) {
if (path.lastIndexOf('.') < 0) return
return path.slice(path.lastIndexOf('.') + 1)
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
