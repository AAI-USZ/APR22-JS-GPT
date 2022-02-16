




var extname = require('path').extname,
fs = require('fs')



var engines = {}



var partials = {}



exports.View = Plugin.extend({
extend: {



init: function() {



if (!set('views'))
set('views', function(){ return set('root') + '/views' })

if (!set('partials'))
set('partials', function(){ return set('views') + '/partials' })

if (set('cache view partials')) {
var dir = set('partials')
fs.readdirSync(dir).each(function(file){
var fullpath = dir + '/' + file
partials[fullpath] = fs.readFileSync(fullpath)
})
}




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
return this.render(view, options)
}, this).join('')
} else
return this.render(view, options)
},



render: function(view, options) {
var self = this,
options = options || {},
partial = options.partial,
path = set(partial ? 'partials' : 'views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
if (!partial) self.contentType(ext)
function render(content) {
content = (engines[type] = engines[type] || require(type)).render(content, options)
if (layout)
self.render(layout + '.' + type + ext, options.mergeDeep({
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
if (partial)
return render(partials[path] || fs.readFileSync(path))
fs.readFile(path, function(err, content){
if (err) throw err
set('cache view contents')
? self.cache.set('view:' + path, content, function(cache){
render(cache)
})
: render(content)
})
}
if (!partial && set('cache view contents'))
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

