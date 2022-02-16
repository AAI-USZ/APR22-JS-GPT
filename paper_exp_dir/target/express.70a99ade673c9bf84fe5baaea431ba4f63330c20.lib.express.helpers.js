exports.extname = function(path) {
if (path.lastIndexOf('.') < 0) return
return path.slice(path.lastIndexOf('.') + 1)
