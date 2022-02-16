




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



Request.include({



cookie: function(key, val) {
if (!this.response.cookie) this.response.cookie = {}
return val === undefined ?
this.response.cookie[key] :
this.response.cookie[key] = val
}
})



exports.Cookie = Plugin.extend({
on: {
request: function(event) {
if (event.request.headers.cookie)
event.request.response.cookie = exports.parseCookie(event.request.headers.cookie)
},

response: function(event) {
if (event.request.response.cookie)
event.request.header('set-cookie', exports.compileCookie(event.request.response.cookie))
}
}
})
