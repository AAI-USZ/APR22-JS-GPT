
CSSColors = Plugin.extend({
extend: {
init: function() {
this.initialized = true
}
},
on: {
response: function(event) {
if (event.response.headers['content-type'] == mime('css'))
event.response.body = event.response.body.replace('black', '#000')
}
