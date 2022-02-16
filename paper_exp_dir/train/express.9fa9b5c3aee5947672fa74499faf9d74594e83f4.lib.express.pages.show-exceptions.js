


var style = require('express/pages/style').style



function stack(e) {
if (e.stack)
return $(e.stack.split('\n').slice(1)).map(function(val, i){
if (!i)
return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
return '<li>' + val
.replace(/\(([^:]+)/, '(<span class="path">$1</span>')
.replace(/(:\d+:\d+)/, '<span class="line">$1</span>') +
'</li>'
}).join('\n')
}



function hash(hash) {
if (!$(hash).length()) return '<tr><td class="empty" colspan="2">Empty</td></tr>'
return $(hash).map(function(val, key){
return '<tr><td>' + key + ':</td><td>' + JSON.encode(val) + '</td></tr>'
}).join('\n')
}

exports.render = function(request, e) {
request.contentType('html')
return '<html>                                     \n\
