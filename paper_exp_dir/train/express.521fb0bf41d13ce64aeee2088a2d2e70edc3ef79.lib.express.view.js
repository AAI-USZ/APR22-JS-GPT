


var posix = require('posix')

var engine = {
ejs: require('support/ejs'),
haml: require('support/haml')
}



var render = exports.render = function(view, options) {
var path = set('views') + '/' + view,
type = path.split('.').slice(-2)[0],
