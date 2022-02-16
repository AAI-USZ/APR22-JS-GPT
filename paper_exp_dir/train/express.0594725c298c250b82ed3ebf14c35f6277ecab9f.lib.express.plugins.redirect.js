




exports.redirect = function(uri) {
header('location', uri)
halt(302)
}

exports.Redirect = Plugin.extend({
init: function() {
this.__super__.apply(arguments)
