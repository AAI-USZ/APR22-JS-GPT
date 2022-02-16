


var posix = require('posix')



var cache = {}



var engine = {
ejs: require('support/ejs'),
haml: require('support/haml')
}



var render = exports.render = function(view, options) {
options = options || {}
var path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
layout = options.layout === undefined ? true : options.layout
contentType(ext)
function go(content) {
content = engine[type].render(content, options)
if (layout)
render('layout.' + type + '.' + ext, process.mixin(options, {
