




var formats = {
common: function (event, start) {
printf('%s - - [%s] "%s %s HTTP/%d" %s %d %0.3f\n',
event.request.connection.remoteAddress,
formatDate(new Date),
event.request.method.uppercase,
event.request.url.pathname || '/',
event.request.httpVersion,
event.request.response.status,
event.request.response.headers['content-length'] || 0,
