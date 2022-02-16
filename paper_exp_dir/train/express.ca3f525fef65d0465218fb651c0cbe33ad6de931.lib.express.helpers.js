




JSON.encode = JSON.stringify
JSON.decode = JSON.parse



exports.dirname = function(path) {
return path.split('/').slice(0, -1).join('/')
}


