var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var useragent = require('useragent')

exports.browserFullNameToShort = function (fullName) {
var agent = useragent.parse(fullName)
return agent.family !== 'Other' ? agent.toAgent() + ' (' + agent.os + ')' : fullName
}

exports.isDefined = function (value) {
return !_.isUndefined(value)
}

