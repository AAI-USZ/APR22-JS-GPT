


exports.BodyDecoder = Plugin.extend({
on: {



request: function(event) {
var request = event.request
if (request.header('content-type') &&
request.header('content-type').indexOf('application/x-www-form-urlencoded') > -1)
request.params.post = parseParams(request.body)
}
}
})
