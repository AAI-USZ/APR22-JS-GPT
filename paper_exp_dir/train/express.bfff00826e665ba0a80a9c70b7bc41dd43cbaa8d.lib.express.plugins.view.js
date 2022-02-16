




var utils = require('express/utils'),
fs = require('fs')



var engine = {
ejs: require('ejs'),
haml: require('haml'),
sass: require('sass')
}



exports.View = Plugin.extend({
extend: {



init: function() {



set('views', function(){ return set('root') + '/views' })



Request.include({



render: function(view, options) {
var self = this,
options = options || {},
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = utils.extname(path),
layout = options.layout === undefined ? 'layout' : options.layout
options.context = options.context || this
self.contentType(ext)
function render(content) {
content = engine[type].render(content, options)
