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

var gsParser = function (pattern, out) {
if (pattern === '**') {
out.glob_star++
return out
}
return parser(pattern, out)
}

var compareWeightObject = function (w1, w2) {
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
return gsParser(p, prev)
}, {glob_star: 0, ext_glob: 0, word: 0, star: 0, optional: 0, range: 0})
if (prev === undefined) return r
return compareWeightObject(r, prev) > 0 ? r : prev
}, undefined)
result.glob_sets = m.set.length
return [result.glob_sets, result.glob_star, result.star, result.ext_glob, result.range, result.optional]
}

exports.mmComparePatternWeights = function (weight1, weight2) {
var n1, n2, diff
n1 = weight1[0]
n2 = weight2[0]
diff = n1 - n2
if (diff !== 0) return diff / Math.abs(diff)
return weight1.length > 1 ? exports.mmComparePatternWeights(weight1.slice(1), weight2.slice(1)) : 0
}

exports.isFunction = _.isFunction
exports.isString = _.isString
exports.isObject = _.isObject
exports.isArray = _.isArray
exports.isNumber = _.isNumber

var ABS_URL = /^https?:\/\
exports.isUrlAbsolute = function (url) {
return ABS_URL.test(url)
}

exports.camelToSnake = function (camelCase) {
return camelCase.replace(/[A-Z]/g, function (match, pos) {
return (pos > 0 ? '_' : '') + match.toLowerCase()
