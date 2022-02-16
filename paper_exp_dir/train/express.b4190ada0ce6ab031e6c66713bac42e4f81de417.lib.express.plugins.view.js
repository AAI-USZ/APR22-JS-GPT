




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



partial: function(view, options) {
var options = options || {}
options.partial = true
options.layout = false
if (options.collection) {
var name = options.as || view.split('.').first
options.locals = options.locals || {}
return options.collection.map(function(val){
options.locals[name] = val
return this.render('partials/' + view, options)
}, this).join('')
} else
return this.render('partials/' + view, options)
},



render: function(view, options) {
var self = this,
options = options || {},
partial = options.partial,
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
if (!partial) self.contentType(ext)
function render(content) {
content = (engines[type] = engines[type] || require(type)).render(content, options)
if (layout)
self.render(layout + '.' + type + ext, utils.mixin(true, options, {
layout: false,
locals: {
body: content
}
}))
else if (partial)
return content
else
self.halt(200, content)
}
function renderFromDisc() {
if (partial) return render(fs.readFileSync(path))
fs.readFile(path, function(err, content){
if (err) throw err
set('cache view contents')
? self.cache.set('view:' + path, content, function(cache){
render(cache)
})
: render(content)
})
}
if (set('cache view contents'))
self.cache.get('view:' + path, function(cache){
if (cache) return render(cache)
else return renderFromDisc()
})
else
return renderFromDisc()
}
})
}
}
})

