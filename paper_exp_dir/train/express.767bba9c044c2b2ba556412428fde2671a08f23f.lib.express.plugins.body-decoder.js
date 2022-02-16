




var queryString = require('querystring')



exports.BodyDecoder = Plugin.extend({
on: {



request: function(event) {
var request = event.request
if (request.header('Content-Type') &&
request.header('Content-Type').includes('application/x-www-form-urlencoded'))
request.params.post = queryString.parse(request.body)
}
}
})
