




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
Express.server.run.apply(Express.server, arguments)
}



exports.configure = function(environment, fn) {
if (environment instanceof Function)
fn = environment, environment = 'all'
if (fn instanceof Function)
return Express.config.push([environment, fn])
if (typeof environment != 'string')
throw new Error('environment required')
for (var i = 0, len = Express.config.length; i < len; ++i)
if (Express.config[i][0] == environment ||
Express.config[i][0] == 'all')
Express.config[i][1].call(Express)
}



exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')
