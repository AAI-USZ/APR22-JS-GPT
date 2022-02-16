




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
printf(' "%s" "%s"',
event.request.headers['referrer'] || event.request.headers['referer'] || '-',
event.request.headers['user-agent'])
},
plot: function(event, start) {
sys.print(Number(new Date) - start)
}
}



exports.Logger = Plugin.extend({
extend: {



init: function(options) {
this.merge(options || {})
}
},

on: {



request: function(event) {
this.start = Number(new Date)
},



response: function(event) {
formats[exports.Logger.format || 'common'](event, this.start || Number(new Date))
sys.print('\n')
}
}
})
