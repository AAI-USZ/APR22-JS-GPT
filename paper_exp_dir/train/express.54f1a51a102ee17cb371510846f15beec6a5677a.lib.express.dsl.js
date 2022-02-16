




var http = require('express/http')



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
if (path.indexOf('http://') === 0)
return http[method].apply(this, arguments)
else if (!Express.server.running)
Express.routes.push(new Route(method, path, fn, options))
else
throw new Error('cannot create route ' + method.toUpperCase() + " `" + path + "' at runtime")
}
}



exports.set = function(option, val) {
return val === undefined ?
Express.settings[option] instanceof Function ?
