




var posix = require('posix')



var engine = {
ejs: require('support/ejs/ejs'),
haml: require('support/haml/lib/haml')
}



exports.View = Plugin.extend({
