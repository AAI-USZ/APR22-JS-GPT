




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
file = dir + '/' + file
partials[file] = fs.readFileSync(file)
})
}



