




var ExpressError = exports.ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
})



exports.InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})



exports.InvalidResponseBody = ExpressError.extend({
name: 'InvalidResponseBody',
init: function(request) {
this.message = request.method + ' ' + jsonEncode(request.uri.path) + ' did not respond with a body string'
}
})
