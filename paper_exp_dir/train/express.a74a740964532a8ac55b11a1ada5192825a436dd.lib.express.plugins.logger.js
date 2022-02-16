




var sys = require('sys'),
printf = require('ext').printf



var formats = {
common: function(event, start) {
printf('%s - - [%s] "%s %s HTTP/%d.%d" %s %d %0.3f',
event.request.socket.remoteAddress,
(new Date).format('%d/%b/%Y %H:%M:%S'),
event.request.method.uppercase,
event.request.url.pathname || '/',
