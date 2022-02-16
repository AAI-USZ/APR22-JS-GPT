




exports.redirect = function(uri) {
header('location', uri)
halt(302)
}



process.mixin(GLOBAL, exports)



exports.Redirect = Plugin.extend({
on: {
request: function(event) {
home = set('home') ||
set('basepath') ||
'/'
back = header('referrer') ||
header('referer')
}
}
})
