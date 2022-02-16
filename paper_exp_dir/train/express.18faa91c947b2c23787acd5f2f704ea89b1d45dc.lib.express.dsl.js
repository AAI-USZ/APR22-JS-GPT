




function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
Express.routes.push(new Route(method, path, fn, options))
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
if (fn instanceof Function)
return Express.config.push([env, fn])
if (typeof env !== 'string')
throw new TypeError('environment required')
Express.config.each(function(conf){
if (conf[0] === env ||
conf[0] === 'all')
conf[1].call(Express)
})
}



exports.param = function(key, fn) {
if (typeof key !== 'string')
throw new TypeError('param key must be a string')
if (typeof fn !== 'function')
throw new TypeError('param must pass a function to process "' + key + '"')
Express.params[key] = fn
}


