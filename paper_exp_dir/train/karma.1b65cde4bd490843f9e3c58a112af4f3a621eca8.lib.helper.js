var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var useragent = require('useragent')
var Promise = require('bluebird')

exports.browserFullNameToShort = function (fullName) {
var agent = useragent.parse(fullName)
var isKnown = agent.family !== 'Other' && agent.os.family !== 'Other'
return isKnown ? agent.toAgent() + ' (' + agent.os + ')' : fullName
}

exports.isDefined = function (value) {
return !_.isUndefined(value)
}
