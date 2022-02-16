


var style = require('express/pages/style').style

exports.render = function(request) {
request.contentType('html')
var method = request.method.toLowerCase(),
path = request.uri.path || '/'
return '<html>                                         \n\
<head>                                             \n\
<title>Express -- Not Found</title>              \n\
' + style + '                                    \n\
</head>                                            \n\
<body>                                             \n\
