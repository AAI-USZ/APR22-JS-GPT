


var posix = require('posix')



var render = exports.render = function(view, options) {
var path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
engine = require('support/' + type),
layout = options.layout === undefined ? true : options.layout
posix
.cat(path)
.addCallback(function(content){
content = engine.parse(content, options)
if (layout)
render('layout.' + type + '.' + ext, process.mixin(options, {
