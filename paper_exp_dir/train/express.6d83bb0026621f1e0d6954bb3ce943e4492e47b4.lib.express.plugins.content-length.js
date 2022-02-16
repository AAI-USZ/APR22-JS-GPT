


exports.ContentLength = Plugin.extend({
on: {



response: function(event) {
var res = event.request.response
response.headers['content-length'] =
response.headers['content-length'] ||
response.body.length
}
}
})
