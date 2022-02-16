


var posix = require('posix')



var cache = {}



var engine = {
ejs: require('support/ejs'),
haml: require('support/haml')
}



Request.include({



render: function(view, options) {
var self = this,
options = options || {},
path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
ext = extname(path),
