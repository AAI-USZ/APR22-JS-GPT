


exports.ContentLength = Plugin.extend({
on: {



response: function(event, callback) {
var response = event.request.response
response.headers['content-length'] =
response.headers['content-length'] ||
response.body.length
callback();
}
}
