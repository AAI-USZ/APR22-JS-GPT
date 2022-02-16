


var style = require('express/pages/style').style



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
if (!hash || !hash.values.length) return '<tr><td class="empty" colspan="2">Empty</td></tr>'
return hash.map(function(val, key){
return '<tr><td>' + key + ':</td><td>' + JSON.encode(val) + '</td></tr>'
}).join('\n')
}

exports.render = function(request, e) {
request.contentType('html')
return '<html>                                     \n\
<head>                                         \n\
<title>Express -- ' + e + '</title>          \n\
' + style + '                                \n\
</head>                                        \n\
<body>                                         \n\
<div id="wrapper">                           \n\
<h1>Express</h1>                           \n\
<h2><em>500</em> ' + e + '</h2>            \n\
<ul id="stacktrace">                       \n\
' + stack(e) + '                         \n\
</ul>                                      \n\
<h3>Request</h3>                           \n\
<table id="request-headers">               \n\
' + hash(request.headers) + '            \n\
</table>                                   \n\
<h3>Response</h3>                          \n\
<table id="response-headers">              \n\
' + hash(request.response.headers) + '   \n\
</table>                                   \n\
<h3>Params</h3>                            \n\
<table id="route-params">                  \n\
' + hash(request.params.path) + '        \n\
</table>                                   \n\
<h3>GET</h3>                               \n\
<table id="get-params">                    \n\
' + hash(request.params.get) + '         \n\
</table>                                   \n\
<h3>POST</h3>                              \n\
<table id="post-params">                   \n\
' + hash(request.params.post) + '        \n\
</table>                                   \n\
</div>                                       \n\
</body>                                        \n\
</html>'
}
