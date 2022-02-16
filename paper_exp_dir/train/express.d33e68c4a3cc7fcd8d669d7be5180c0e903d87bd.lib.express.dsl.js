




function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
Express.routes.push(new Route(method, path, fn, options))
}
}

exports.set = function(option, val) {
return val === undefined ?
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
Express.server.run()
}

exports.configure = function(environment, fn) {
if (environment instanceof Function)
fn = environment, environment = 'all'
if (fn instanceof Function)
