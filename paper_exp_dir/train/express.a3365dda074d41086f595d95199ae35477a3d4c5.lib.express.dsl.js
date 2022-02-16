




function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
if (!Express.server.running)
Express.routes.push(new Route(method, path, fn, options))
else
throw new Error('cannot create route ' + method.toUpperCase() + " `" + path + "' at runtime")
}
}
