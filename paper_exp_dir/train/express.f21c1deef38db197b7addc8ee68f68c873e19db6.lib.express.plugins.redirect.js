


exports.Redirect = Plugin.extend({
extend: {
init: function() {
Request.include({



redirect: function(uri, code) {
if (uri == 'back' || uri == 'home') uri = this[uri]
this.header('location', uri)
this.halt(code || 303)
}
