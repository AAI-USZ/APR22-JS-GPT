




var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']



function format(date) {
var d = date.getDate(),
m = months[date.getMonth()],
y = date.getFullYear(),
h = date.getHours(),
mi = date.getMinutes(),
s = date.getSeconds()
return (d < 10 ? '0' : '') + d + '/' + m + '/' + y + ' ' +
(h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') +
mi + ':' + (s < 10 ? '0' : '') + s
}



exports.CommonLogger = Plugin.extend({
on: {



response: function(event) {
puts([event.request.connection.remoteAddress,
'-',
'-',
'[' + format(new Date) + ']',
'"' + event.request.method.toUpperCase() + ' ' + (event.request.url.pathname || '/') +
' HTTP/' + event.request.httpVersion + '"',
event.request.response.status,
event.request.response.headers['content-length'] || 0].join(' '))
return true;
}
}
})
