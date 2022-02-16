




var http = require('express/http')



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
if (path.startsWith('http://'))
return http[method].apply(this, arguments)
else if (!Express.server.running)
Express.routes.push(new Route(method, path, fn, options))
else
throw new Error('cannot create route ' + method.toUpperCase() + " `" + path + "' at runtime")
}
}



exports.set = function(option, val) {
return val === undefined
? Express.settings[option] instanceof Function
? Express.settings[option]()
: Express.settings[option]
: Express.settings[option] = val
}



exports.enable = function(option) {
set(option, true)
}



exports.disable = function(option) {
set(option, false)
}



exports.run = function() {
configure(Express.environment = process.env.EXPRESS_ENV || 'development')
Express.plugins.each(function(plugin){
if ('init' in plugin.klass)
plugin.klass.init(plugin.options)
})
Express.server.run.apply(Express.server, arguments)
}



exports.configure = function(env, fn) {
if (env instanceof Function)
fn = env, env = 'all'
