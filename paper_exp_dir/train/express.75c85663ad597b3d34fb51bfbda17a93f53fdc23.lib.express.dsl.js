




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



exports.disable = function(option) {
set(option, false)
}



exports.run = function() {
configure(Express.environment = process.ENV.EXPRESS_ENV || 'development')
$(Express.plugins).each(function(plugin){
if ('init' in plugin.klass)
plugin.klass.init(plugin.options)
})
Express.server.run.apply(Express.server, arguments)
}



exports.configure = function(environment, fn) {
