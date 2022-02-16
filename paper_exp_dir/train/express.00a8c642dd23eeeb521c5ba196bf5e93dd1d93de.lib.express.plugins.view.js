




var utils = require('express/utils'),
extname = require('path').extname,
fs = require('fs')



var engines = {}



exports.View = Plugin.extend({
extend: {



init: function() {



if (!set('views'))
set('views', function(){ return set('root') + '/views' })



Request.include({



render: function(view, options) {
var self = this,
options = options || {},
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
self.contentType(ext)
function render(content) {
content = (engines[type] = engines[type] || require(type)).render(content, options)
if (layout)
self.render(layout + '.' + type + ext, utils.mixin(true, options, {
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
fs.readFile(path, function(err, content){
if (err) throw err
set('cache view contents')
? render(self.cache.set(path, content))
: render(content)
})
}
})
}
}
})

