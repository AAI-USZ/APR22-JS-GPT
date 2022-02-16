




ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
})



InvalidResponseBody = ExpressError.extend({
name: 'InvalidResponseBody',
init: function(request) {
this.message = request.method + ' ' + JSON.encode(request.uri.path) + ' did not respond with a body string'
}
})
