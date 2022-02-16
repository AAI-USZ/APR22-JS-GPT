


var posix = require('posix')



var render = exports.render = function(view, options) {
var path = set('views') + '/' + view,
ext = extname(path),
engine = require('support/' + ext),
layout = options.layout === undefined ? true : options.layout
posix
.cat(path)
.addCallback(function(content){
