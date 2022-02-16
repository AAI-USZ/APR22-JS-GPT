




var extname = require('path').extname,
fs = require('fs')



var engines = {}



var cache = { views: {}, partials: {}}



function cacheFiles(type) {
var dir = set(type)
fs.readdirSync(dir).each(function(file){
file = dir + '/' + file
if (!fs.statSync(file).isFile()) return
cache[type][file] = fs.readFileSync(file)
})
}



exports.View = Plugin.extend({
extend: {



init: function() {



if (!set('views'))
set('views', function(){ return set('root') + '/views' })

if (!set('partials'))
set('partials', function(){ return set('views') + '/partials' })



if (set('cache view contents'))
cacheFiles('views')

if (set('cache view partials'))
cacheFiles('partials')



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



render: function(view, options, callback) {
var self = this,
options = options || {},
type = options.partial ? 'partials' : 'views',
path = set(type) + '/' + view,
engine = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
if (type === 'views') self.contentType(ext)
function render(content) {
content = (engines[engine] = engines[engine] || require(engine)).render(content, options)
if (layout)
self.render(layout + '.' + engine + ext, options.mergeDeep({
layout: false,
locals: { body: content }
}), callback)
else if (type === 'partials')
return content
else if (callback)
callback.call(self, null, content)
else
self.halt(200, content)
}
return render(cache[type][path] || fs.readFileSync(path))
}
})
}
}
})

