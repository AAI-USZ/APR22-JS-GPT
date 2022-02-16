


var style = require('express/pages/style').style

exports.render = function(e) {
contentType('html')
if (e.stack)
var stack = $(e.stack.split('\n').slice(1)).map(function(val, i){
if (!i)
return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
return '<li>' + val
.replace(/\(([^:]+)/, '(<span class="path">$1</span>')
