


var queryString = require('querystring')

exports.BodyDecoder = Plugin.extend({
on: {



request: function(event, callback) {
var request = event.request
if (request.header('content-type') &&
request.header('content-type').indexOf('application/x-www-form-urlencoded') > -1)
request.params.post = queryString.parseQuery(request.body)

