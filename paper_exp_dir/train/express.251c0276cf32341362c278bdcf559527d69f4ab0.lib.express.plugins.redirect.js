




Request.include({



redirect: function(uri, code) {
if (uri == 'back' || uri == 'home') uri = this[uri]
this.header('location', uri)
this.halt(code || 303)
}
})



exports.Redirect = Plugin.extend({
on: {
request: function(event) {
event.request.home = set('home') || set('basepath') || '/'
event.request.back = event.request.header('referrer') || event.request.header('referer')
}
}
})
