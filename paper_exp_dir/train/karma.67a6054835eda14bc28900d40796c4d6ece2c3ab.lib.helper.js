var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var useragent = require('useragent')

exports.browserFullNameToShort = function (fullName) {
var agent = useragent.parse(fullName)
return agent.toAgent() + ' (' + agent.os + ')'
}

exports.isDefined = function (value) {
