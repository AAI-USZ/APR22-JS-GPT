




var ExpressError = exports.ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
})



exports.NotFoundError = ExpressError.extend({
name: 'NotFoundError',
init: function(request) {
this.message = 'failed to find ' + request.method + ' ' + jsonEncode(request.uri.path)
}
})



exports.InvalidStatusCode = ExpressError.extend({
name: 'InvalidStatusCode',
init: function(status) {
this.message = status + ' is an invalid HTTP response code'
}
})
