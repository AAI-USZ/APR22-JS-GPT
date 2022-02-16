




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
layout = options.layout === undefined ? 'layout' : options.layout
options.merge({ cache: true, filename: path })

if (['haml', 'sass', 'ejs'].indexOf(contentType) !== -1) {
Ext.warn('views now take the form NAME.TYPE.ENGINE such as "page.html.haml" instead of "page.haml.html".' +
' Will be removed in 0.9.0')
var swap = contentType
contentType = engine
engine = swap
path = set(type) + '/' + parts.first + '.' + contentType + '.' + engine
}
