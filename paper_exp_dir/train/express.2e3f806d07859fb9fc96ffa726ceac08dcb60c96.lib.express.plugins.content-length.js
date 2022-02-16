


exports.ContentLength = Plugin.extend({
on: {



response: function(event) {
var response = event.request.response
if (!response.chunkedEncoding)
if (!response.headers['Content-Length'] && response.body)
response.headers['Content-Length'] = response.body.length
}
}
})
