


exports.ContentLength = Plugin.extend({
on: {



response: function(event) {
var response = event.request.response
if (!response.chunkedEncoding)
if (!response.headers['content-length'] && response.body)
response.headers['content-length'] = response.body.length
}
}
})
