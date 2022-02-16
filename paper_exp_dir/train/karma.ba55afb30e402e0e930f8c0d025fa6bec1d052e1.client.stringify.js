var serialize = require('dom-serialize')
var instanceOf = require('./util').instanceOf
var isNode = function (obj) {
return (obj.tagName || obj.nodeName) && obj.nodeType
}

var stringify = function stringify (obj, depth) {
if (depth === 0) {
return '...'
}

if (obj === null) {
