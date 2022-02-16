




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
var name = view.split('.').first
options.locals = options.locals || {}
return options.collection.map(function(val){
options.locals[name] = val
return this.render('partials/' + view, options)
}, this).join('\n')
} else
return this.render('partials/' + view, options)
},
