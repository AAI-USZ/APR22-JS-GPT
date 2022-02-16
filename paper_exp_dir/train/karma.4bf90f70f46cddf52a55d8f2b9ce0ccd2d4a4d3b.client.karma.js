var stringify = require('../common/stringify')
var constant = require('./constants')
var util = require('../common/util')

function Karma (updater, socket, iframe, opener, navigator, location, document) {
this.updater = updater
var startEmitted = false
var karmaNavigating = false
var self = this
var queryParams = util.parseQueryParams(location.search)
var browserId = queryParams.id || util.generateId('manual-')
var displayName = queryParams.displayName
var returnUrl = queryParams['return_url' + ''] || null

