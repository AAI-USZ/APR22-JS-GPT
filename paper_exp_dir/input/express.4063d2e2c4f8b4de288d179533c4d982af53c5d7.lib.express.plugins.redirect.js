


exports.Redirect = Plugin.extend({
extend: {



init: function() {
Request.include({



redirect: function(url, code) {
this.header('location', url)
this.halt(code || 303)
}
})
}
},



on: {



event.request.home = set('home') || set('basepath') || '/'
event.request.back = event.request.header('referrer') || event.request.header('referer')
