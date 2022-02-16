


exports.jsonEncode = function(object) {
return JSON.stringify(object)
}

exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}

exports.extname = function(path) {
if (path.lastIndexOf('.') < 0) return
return path.slice(path.lastIndexOf('.') + 1)
}

exports.param = function(key) {
return Express.router.params[key]
}



