var stringify = require('../common/stringify')
var constant = require('./constants')
var util = require('../common/util')

function Karma (socket, iframe, opener, navigator, location, document) {
var startEmitted = false
var karmaNavigating = false
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var displayName = queryParams.displayName
var returnUrl = queryParams['return_url' + ''] || null

var resultsBufferLimit = 50
var resultsBuffer = []







var policy = {
createURL: function (s) {
return s
},
createScriptURL: function (s) {
return s
}
}
var trustedTypes = window.trustedTypes || window.TrustedTypes
if (trustedTypes) {
policy = trustedTypes.createPolicy('karma', policy)
if (!policy.createURL) {





policy.createURL = function (s) { return s }
}
}





