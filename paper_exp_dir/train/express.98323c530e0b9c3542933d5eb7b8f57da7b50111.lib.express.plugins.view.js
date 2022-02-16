




var extname = require('path').extname,
fs = require('fs')



var engines = {}



var partials = {}



exports.View = Plugin.extend({
extend: {



init: function() {



if (!set('views'))
set('views', function(){ return set('root') + '/views' })
