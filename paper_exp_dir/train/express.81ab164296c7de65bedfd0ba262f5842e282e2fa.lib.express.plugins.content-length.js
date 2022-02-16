


exports.ContentLength = Plugin.extend({
on: {



response: function(event) {
var response = event.request.response
response.headers['content-length'] =
response.headers['content-length'] ||
process._byteLength(response.body)
}
}
})
