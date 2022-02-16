




var Request = require('./../request').Request,
extname = require('path').extname,
fs = require('fs')



var engines = {}



var cache = { views: {}, partials: {} }




var helpers = exports.helpers = {}



function cacheFiles(type) {
(function cacheDir(dir) {
try {
fs.readdirSync(dir).each(function(file){
file = dir + '/' + file
var stat = fs.statSync(file)
if (stat.isDirectory() && file != set('partials'))
cacheDir(file)
else if (stat.isFile())
cache[type][file] = fs.readFileSync(file, 'utf8')
})
} catch (err) {
if (err.errno !== process.ENOENT) throw e
}
})(set(type))
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
var name = options.as || view.split('.').first,
len = options.collection.length
options.locals = options.locals || {}
options.locals.__length__ = len
return options.collection.map(function(val, i){
options.locals.__isFirst__ = i === 0
options.locals.__index__ = i
options.locals.__isLast__ = i === len - 1
options.locals[name] = val
return this.render(view, options)
}, this).join('')
} else
return this.render(view, options)
},



render: function(view, options, callback) {
var options = options || {},
type = options.partial ? 'partials' : 'views',
path = set(type) + '/' + view,
parts = view.split('.'),
engine = parts.last,
contentType = parts.slice(-2)[0],
layout = options.layout === undefined
? 'layout'
: options.layout
options.locals = options.locals || {}
Object.merge(options.locals, helpers)
options.filename = path
if (set('cache view contents'))
options.cache = true
var content = cache[type][path] || fs.readFileSync(path).toString(options.encoding || 'utf8')
options.context = options.context || this
content = (engines[engine] = engines[engine] || require(engine)).render(content, options)
if (type === 'views') this.contentType(contentType)
if (layout) {
layout = layout.indexOf('.') !== -1
? layout
: [layout, contentType, engine].join('.')
this.render(layout, Object.mergeDeep(options, {
layout: false,
locals: { body: content }
}), callback)
} else if (type === 'partials')
return content
else if (callback)
callback.call(this, null, content)
else
this.respond(200, content, options.encoding)
}
})
}
}
})
