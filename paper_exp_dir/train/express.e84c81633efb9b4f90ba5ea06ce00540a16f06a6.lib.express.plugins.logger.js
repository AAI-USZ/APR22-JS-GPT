




var sys = require('sys')



var formats = {
common: function(event, start) {
printf('%s - - [%s] "%s %s HTTP/%d" %s %d %0.3f',
event.request.connection.remoteAddress,
formatDate(new Date),
event.request.method.uppercase,
