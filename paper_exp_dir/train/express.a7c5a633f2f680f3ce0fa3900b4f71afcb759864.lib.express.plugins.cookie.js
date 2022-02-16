




exports.parseCookie = function(cookie) {
return $(cookie.replace(/^ *| *$/g, '').split(/ *; */)).reduce({}, function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0].toLowerCase()] = parts[1]
return hash
})
}



exports.cookie = function(key) {
return Express.server.request.cookie[key]
}



exports.Cookie = Plugin.extend({
init: function() {
this.__super__.apply(arguments)
process.mixin(GLOBAL, exports)
},
on: {
request: function(event) {
if (event.request.headers.cookie)
event.request.cookie = exports.parseCookie(event.request.headers.cookie)
}
}
})
