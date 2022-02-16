




function route(method) {
return function(path, options, callback){
if (options instanceof Function)
callback = options, options = {}
Express.routes.push(new Route(method, path, callback, options))
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



exports.configure = function(env, callback) {
if (env instanceof Function)
callback = env, env = 'all'
if (callback instanceof Function)
return Express.config.push([env, callback])
if (typeof env !== 'string')
throw new TypeError('environment required')
Express.config.each(function(conf){
if (conf[0] === env ||
conf[0] === 'all')
conf[1].call(Express)
})
}



exports.param = function(key, callback) {
if (typeof key !== 'string')
throw new TypeError('param key must be a string')
if (typeof callback !== 'function')
throw new TypeError('param must pass a function to process "' + key + '"')
Express.params[key] = callback
}



exports.notFound = function(callback) {
Express.notFound = callback
}



exports.error = function(callback) {
Express.error = callback
}



exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')
