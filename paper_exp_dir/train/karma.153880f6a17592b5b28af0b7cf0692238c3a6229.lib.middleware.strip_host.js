

var createStripHostMiddleware = function () {
return function (request, response, next) {
function stripHostFromUrl (url) {
return url.replace(/^http[s]?:\/\/([a-z\-.:\d]+)\
}

request.normalizedUrl = stripHostFromUrl(request.url) || request.url
next()
}
}


exports.create = createStripHostMiddleware
