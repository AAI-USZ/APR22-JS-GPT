




var posix = require('posix')



var engine = {
ejs: require('support/ejs/ejs'),
haml: require('support/haml/lib/haml'),
sass: require('support/sass/lib/sass')
}



exports.View = Plugin.extend({
extend: {



init: function() {



set('views', function(){ return set('root') + '/views' })
