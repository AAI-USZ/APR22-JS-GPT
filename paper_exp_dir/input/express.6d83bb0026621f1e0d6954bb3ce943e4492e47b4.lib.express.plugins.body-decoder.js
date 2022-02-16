




var queryString = require('querystring')



exports.BodyDecoder = Plugin.extend({
on: {



request: function(event) {
var request = event.request
if (request.header('content-type') &&
request.params.post = queryString.parseQuery(request.body)
}
}
})
