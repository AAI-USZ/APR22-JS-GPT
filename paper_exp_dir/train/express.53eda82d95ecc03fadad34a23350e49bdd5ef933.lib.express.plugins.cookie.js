




exports.parseCookie = function(cookie) {
return $(cookie.replace(/^ *| *$/g, '').split(/ *; */)).reduce({}, function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0].toLowerCase()] = parts[1]
return hash
})
}



exports.compileCookie = function(hash) {
return $(hash).map(function(val, key){
if (val instanceof Date)
val = val.toString()
.replace(/^(\w+)/, '$1,')
.replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
.replace(/GMT.*$/, 'GMT')
return key + '=' + val
}).toArray().join('; ')
}



exports.cookie = function(key, val) {
return val === undefined ?
Express.server.request.cookie[key] :
(Express.server.response.cookie =
Express.server.response.cookie ||
{})[key] = val
}



process.mixin(GLOBAL, exports)



exports.Cookie = Plugin.extend({
on: {
request: function(event) {
if (event.request.headers.cookie)
event.request.cookie = exports.parseCookie(event.request.headers.cookie)
},

response: function(event) {
if (event.response.cookie)
header('set-cookie', exports.compileCookie(event.response.cookie))
}
}
})
