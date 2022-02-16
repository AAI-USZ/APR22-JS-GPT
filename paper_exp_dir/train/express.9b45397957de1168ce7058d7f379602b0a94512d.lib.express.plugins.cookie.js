




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
Express.server.response.cookie[key] = val
}



exports.Cookie = Plugin.extend({
init: function() {
this.__super__.apply(arguments)
