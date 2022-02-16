




exports.parseCookie = function(cookie) {
return cookie.replace(/^ *| *$/g, '').split(/ *; */).reduce(function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0]] = parts[1]
return hash
}, {})
}



exports.compileCookie = function(name, val, options) {
if (!options) return name + '=' + val
return name + '=' + val + '; ' + options.map(function(val, key){
if (val instanceof Date)
val = val.toString()
.replace(/^(\w+)/, '$1,')
.replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
.replace(/GMT.*$/, 'GMT')
return val === true ? key : key + '=' + val
}).join('; ')
}



exports.Cookie = Plugin.extend({
extend: {



init: function() {
Request.include({



cookie: function(name, val, options) {
options = options || {}
options.path = options.path || '/'
return val ?
this.response.cookies.push(exports.compileCookie(name, val, options)) :
this.cookies[name]
}
})
}
},



on: {



request: function(event) {
event.request.response.cookies = []
event.request.cookies = event.request.headers.cookie
? exports.parseCookie(event.request.headers.cookie)
: {}
return true;
},



response: function(event) {
if (event.response.cookies.length)
event.request.header('set-cookie', event.response.cookies.join(', '))
return true;
}
}
})
