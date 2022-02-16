




var sys = require('sys')



var formats = {
common: function (event, start) {
return [event.request.connection.remoteAddress,
'-',
'-',
'[' + formatDate(new Date) + ']',
