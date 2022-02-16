




exports.parseCookie = function(cookie) {
return $(cookie.replace(/^ *| *$/g, '').split(/ *; */)).reduce({}, function(hash, pair){
var parts = pair.split(/ *= */)
hash[parts[0].toLowerCase()] = parts[1]
return hash
})
}



exports.compileCookie = function(hash) {
return $(hash).map(function(val, key){
return key + '=' + val
}).toArray().join('; ')
}



exports.cookie = function(key) {
return Express.server.request.cookie[key]
}
