
exports.parseCookie = function(cookie) {
return cookie.replace(/^ *| *$/g, '').split(/ *; */).reduce(function(hash, pair){
