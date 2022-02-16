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
return 'null'
}

switch (typeof obj) {
case 'string':
return "'" + obj + "'"
case 'undefined':
return 'undefined'
case 'function':
try {


return obj.toString().replace(/\{[\s\S]*\}/, '{ ... }')
} catch (err) {
if (err instanceof TypeError) {

return 'Proxy(function ' + (obj.name || '') + '(...) { ... })'
} else {
throw err
