var serialize = null
try {
serialize = require('dom-serialize')
} catch (e) {

}

var instanceOf = require('./util').instanceOf

function isNode (obj) {
return (obj.tagName || obj.nodeName) && obj.nodeType
}
