var stringify = require('./stringify')
var constant = require('./constants')
var util = require('./util')

var Karma = function (socket, iframe, opener, navigator, location) {
var hasError = false
var startEmitted = false
var reloadingContext = false
var store = {}
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var returnUrl = queryParams['return_url' + ''] || null

