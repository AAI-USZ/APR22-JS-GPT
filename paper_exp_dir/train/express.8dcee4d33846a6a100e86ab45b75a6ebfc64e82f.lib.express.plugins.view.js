




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
var cache,
self = this,
options = options || {},
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
self.contentType(ext)
function render(content) {
