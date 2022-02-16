




function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
Express.routes.push(new Route(method, path, fn, options))
}
}



exports.set = function(option, val) {
return val === undefined ?
Express.settings[option] instanceof Function ?
Express.settings[option]() :
Express.settings[option] :
Express.settings[option] = val
}



exports.enable = function(option) {
set(option, true)
}
