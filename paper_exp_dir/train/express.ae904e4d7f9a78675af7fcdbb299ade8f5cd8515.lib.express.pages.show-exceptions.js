


var style = require('express/pages/style').style

exports.render = function(request, e) {
request.contentType('html')
if (e.stack)
var stack = $(e.stack.split('\n').slice(1)).map(function(val, i){
if (!i)
return '<li>' + val.replace(/^(.*?):/, '<span class="path">$1</span>:') + '</li>'
return '<li>' + val
.replace(/\(([^:]+)/, '(<span class="path">$1</span>')
.replace(/(:\d+:\d+)/, '<span class="line">$1</span>') +
'</li>'
}).join('\n')
var requestHeaders = $(request.headers).map(function(val, key){
return '<tr><td>' + key + ':</td><td>' + val + '</td></tr>'
}).join('\n')
return '<html>                                     \n\
<head>                                         \n\
<title>Express -- ' + e + '</title>          \n\
' + style + '                                \n\
</head>                                        \n\
<body>                                         \n\
