




var sys = require('sys'),
style = require('express/pages/style').style




function stack(e) {
if (e.stack)
return e.stack.split('\n').slice(1).map(function(val, i){
if (!i)
return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
return '<li>' + val
.replace(/\(([^:]+)/, '(<span class="path">$1</span>')
.replace(/(:\d+:\d+)/, '<span class="line">$1</span>') +
'</li>'
}).join('\n')
}



function hash(hash) {
var keys = Object.keys(hash),
buf = []
if (!keys.length) return '<tr><td class="empty" colspan="2">Empty</td></tr>'
for (var i = 0, len = keys.length; i < len; ++i)
buf.push('<tr><td>' + keys[i] + ':</td><td>' + sys.inspect(hash[keys[i]]) + '</td></tr>')
return buf.join('\n')
}



function stackText(e) {
if (e.stack)
return e.stack.split('\n').slice(1).map(function(val, i){
return '\n   ' + val.strip
}).join('')
}



function hashText(hash) {
var keys = Object.keys(hash),
buf = ''
if (!keys.length) return '\n  Empty'
for (var i = 0, len = keys.length; i < len; ++i)
buf += '\n  ' + keys[i] + ': ' + sys.inspect(hash[keys[i]])
return buf
}

exports.render = function(request, e) {
request.charset = 'UTF-8'
request.contentType('html')
return '<html>                                     \n\
<head>                                         \n\
<title>Express -- ' + e + '</title>          \n\
' + style + '                                \n\
</head>                                        \n\
<body>                                         \n\
<div id="wrapper">                           \n\
<h1>Express</h1>                           \n\
