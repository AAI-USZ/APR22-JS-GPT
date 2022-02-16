




exports.parseCookie = function(cookie) {
return $(cookie.replace(/^ *| *$/g, '').split(/ *; */)).reduce({}, function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0]] = parts[1]
return hash
})
}



exports.compileCookie = function(name, val, options) {
if (!options) return name + '=' + val
return name + '=' + val + '; ' + $(options).map(function(val, key){
if (val instanceof Date)
val = val.toString()
.replace(/^(\w+)/, '$1,')
.replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
.replace(/GMT.*$/, 'GMT')
return val === true ? key : key + '=' + val
}).toArray().join('; ')
}



Request.include({



cookie: function(name, val, options) {
if (!val) return this.response.cookie[name]
this.header('set-cookie', exports.compileCookie(name, val, options))
}
})



exports.Cookie = Plugin.extend({
on: {
request: function(event) {
event.request.response.cookie = {}
if (event.request.headers.cookie)
event.request.response.cookie = exports.parseCookie(event.request.headers.cookie)
},
}
})
