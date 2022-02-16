




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



exports.Cookie = Plugin.extend({
extend: {



init: function() {
Request.include({



cookie: function(name, val, options) {
return val ?
this.response.cookies.push(exports.compileCookie(name, val, options)) :
