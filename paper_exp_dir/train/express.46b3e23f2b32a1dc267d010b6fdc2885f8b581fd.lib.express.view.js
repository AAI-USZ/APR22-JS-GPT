


var posix = require('posix')



var render = exports.render = function(view, options) {
var path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
engine = require('support/' + type),
layout = options.layout === undefined ? true : options.layout
contentType(ext)
posix
.cat(path)
.addCallback(function(content){
content = engine.render(content, options)
if (layout)
render('layout.' + type + '.' + ext, process.mixin(options, {
layout: false,
locals: {
body: content
}
}))
else
halt(200, content)
})
}
