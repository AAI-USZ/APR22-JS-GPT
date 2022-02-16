


var posix = require('posix')



var render = exports.render = function(view, options) {
var path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
engine = require('support/' + type),
layout = options.layout === undefined ? true : options.layout
