var fs = require('graceful-fs')
var path = require('path')
var _ = require('lodash')
var useragent = require('useragent')
var Promise = require('bluebird')
var mm = require('minimatch')

exports.browserFullNameToShort = function (fullName) {
var agent = useragent.parse(fullName)
var isKnown = agent.family !== 'Other' && agent.os.family !== 'Other'
return isKnown ? agent.toAgent() + ' (' + agent.os + ')' : fullName
}

exports.isDefined = function (value) {
return !_.isUndefined(value)
}
var parser = function (pattern, out) {
if (pattern.length === 0) return out
var p = /^(\[[^\]]*\]|[\*\+@\?]\((.+?)\))/g
var matches = p.exec(pattern)
if (!matches) {
var c = pattern[0]
var t = 'word'
if (c === '*') {
t = 'star'
} else if (c === '?') {
t = 'optional'
}
out[t]++
return parser(pattern.substring(1), out)
}
if (matches[2] !== undefined) {
out.ext_glob++
parser(matches[2], out)
return parser(pattern.substring(matches[0].length), out)
}
out.range++
return parser(pattern.substring(matches[0].length), out)
}

if (pattern === '**') {
out.glob_star++
return out
}
return parser(pattern, out)
}

return exports.mmComparePatternWeights(
[w1.glob_star, w1.star, w1.ext_glob, w1.range, w1.optional],
[w2.glob_star, w2.star, w2.ext_glob, w2.range, w2.optional]
)
}

exports.mmPatternWeight = function (pattern) {
var m = new mm.Minimatch(pattern)
if (!m.globParts) return [0, 0, 0, 0, 0, 0]
var result = m.globParts.reduce(function (prev, p) {
var r = p.reduce(function (prev, p) {
