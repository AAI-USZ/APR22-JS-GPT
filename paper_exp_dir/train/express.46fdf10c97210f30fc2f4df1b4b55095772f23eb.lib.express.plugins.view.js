


var posix = require('posix')



var cache = {}



var engine = {
ejs: require('support/ejs/ejs'),
haml: require('support/haml/lib/haml')
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
self.render('layout.' + type + '.' + ext, process.mixin(options, {
layout: false,
locals: {
body: content
}
}))
else
self.halt(200, content)
}
if (set('cache view contents') && cache[view])
render(cache[view])
else
posix.cat(path).addCallback(function(content){
render(cache[view] = content)
}).addErrback(function(e){
throw e
})
}
})
}
}
})

