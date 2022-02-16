




var Request = require('express/request').Request



exports.Redirect = Plugin.extend({
extend: {



init: function() {
Request.include({



redirect: function(url, code) {
if (url === 'back' || url === 'home') url = this[url]
this.header('Location', url)
this.halt(code || 303)
}
})
}
},



on: {



request: function(event) {
event.request.home = set('home') || set('basepath') || '/'
event.request.back = event.request.header('Referrer') || event.request.header('Referer')
}
}
})
