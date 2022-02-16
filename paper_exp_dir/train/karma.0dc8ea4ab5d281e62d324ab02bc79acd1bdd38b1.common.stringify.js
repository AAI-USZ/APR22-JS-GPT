var serialize = require('dom-serialize')
var instanceOf = require('./util').instanceOf

function isNode (obj) {
return (obj.tagName || obj.nodeName) && obj.nodeType
}

function stringify (obj, depth) {
if (depth === 0) {
return '...'
}

