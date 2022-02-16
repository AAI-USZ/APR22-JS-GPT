




var queryString = require('querystring')



exports.BodyDecoder = Plugin.extend({
on: {



request: function(event) {
var request = event.request
