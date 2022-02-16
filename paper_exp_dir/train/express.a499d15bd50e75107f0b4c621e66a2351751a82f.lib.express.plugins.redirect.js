




exports.redirect = function(uri) {
header('location', uri)
halt(302)
}



process.mixin(GLOBAL, exports)



exports.Redirect = Plugin.extend({
on: {
request: function(event) {
event.request.home = set('home') || set('basepath') || '/'
event.request.back = event.request.header('referrer') || event.request.header('referer')
}
}
})
