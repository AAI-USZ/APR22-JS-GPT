var serialize = require('dom-serialize')
var instanceOf = require('./util').instanceOf

var stringify = function stringify (obj, depth) {
if (depth === 0) {
return '...'
}

if (obj === null) {
return 'null'
