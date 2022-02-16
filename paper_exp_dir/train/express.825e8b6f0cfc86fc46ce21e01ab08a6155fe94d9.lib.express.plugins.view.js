




var posix = require('posix')



var engine = {
ejs: require('ejs'),
haml: require('haml'),
sass: require('sass')
}



exports.View = Plugin.extend({
extend: {



init: function() {



set('views', function(){ return set('root') + '/views' })



Request.include({



render: function(view, options) {
var self = this,
options = options || {},
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? true : options.layout
self.contentType(ext)
function render(content) {
content = engine[type].render(content, options)
if (layout)
self.render('layout.' + type + '.' + ext, process.mixin(true, options, {
layout: false,
locals: {
body: content
}
}))
else
self.halt(200, content)
}
if (set('cache view contents') && self.cache.get(path))
render(self.cache.get(path))
else
posix.cat(path).addCallback(function(content){
set('cache view contents') ?
render(self.cache.set(path, content)) :
render(content)
}).addErrback(function(e){
throw e
})
}
})
}
}
})

