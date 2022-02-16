


var posix = require('posix')

exports.render = function(view, options, fn) {
var path = set('views') + '/' + view,
ext = extname(path),
engine = require('support/' + ext),
layout = options.layout || true
posix
.cat(path)
.addCallback(function(content){
halt(200, engine.parse(content, options))
})
