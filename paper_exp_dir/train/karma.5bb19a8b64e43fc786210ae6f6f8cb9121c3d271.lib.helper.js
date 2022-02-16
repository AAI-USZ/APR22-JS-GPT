'use strict'

const fs = require('graceful-fs')
const path = require('path')
const _ = require('lodash')
const useragent = require('ua-parser-js')
const mm = require('minimatch')

exports.browserFullNameToShort = (fullName) => {
const ua = useragent(fullName)
if (!ua.browser.name && !ua.browser.version && !ua.os.name && !ua.os.version) {
return fullName
}
return `${ua.browser.name} ${ua.browser.version || '0.0.0'} (${ua.os.name} ${ua.os.version || '0.0.0'})`
}

exports.isDefined = (value) => {
return !_.isUndefined(value)
}

const parser = (pattern, out) => {
if (pattern.length === 0) return out
const p = /^(\[[^\]]*\]|[*+@?]\((.+?)\))/g
const matches = p.exec(pattern)
if (!matches) {
const c = pattern[0]
let t = 'word'
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

const gsParser = (pattern, out) => {
if (pattern === '**') {
out.glob_star++
return out
}
return parser(pattern, out)
}

const compareWeightObject = (w1, w2) => {
return exports.mmComparePatternWeights(
[w1.glob_star, w1.star, w1.ext_glob, w1.range, w1.optional],
[w2.glob_star, w2.star, w2.ext_glob, w2.range, w2.optional]
)
}

exports.mmPatternWeight = (pattern) => {
const m = new mm.Minimatch(pattern)
if (!m.globParts) return [0, 0, 0, 0, 0, 0]
const result = m.globParts.reduce((prev, p) => {
const r = p.reduce((prev, p) => {
return gsParser(p, prev)
}, { glob_star: 0, ext_glob: 0, word: 0, star: 0, optional: 0, range: 0 })
if (prev === undefined) return r
return compareWeightObject(r, prev) > 0 ? r : prev
}, undefined)
result.glob_sets = m.set.length
return [result.glob_sets, result.glob_star, result.star, result.ext_glob, result.range, result.optional]
}

exports.mmComparePatternWeights = (weight1, weight2) => {
const n1 = weight1[0]
const n2 = weight2[0]
const diff = n1 - n2
if (diff !== 0) return diff / Math.abs(diff)
return weight1.length > 1 ? exports.mmComparePatternWeights(weight1.slice(1), weight2.slice(1)) : 0
}

exports.isFunction = _.isFunction
exports.isString = _.isString
exports.isObject = _.isObject
