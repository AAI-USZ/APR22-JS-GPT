




var sys = require('sys')



var formats = {
common: function(event, start) {
printf('%s - - [%s] "%s %s HTTP/%d.%d" %s %d %0.3f',
event.request.socket.remoteAddress,
(new Date).format('%d/%b/%Y %H:%M:%S'),
event.request.method.uppercase,
event.request.url.pathname || '/',
event.request.httpVersionMajor,
event.request.httpVersionMinor,
event.request.response.status,
event.request.response.headers['content-length'] || 0,
(Number(new Date) - start) / 1000)
},
combined: function(event, start) {
formats.common(event, start)
