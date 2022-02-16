
// Express - DSL - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Return a routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

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

/**
 * Configure _environment_ with _fn_.
 *
 * Global configuration, disregards which
 * environment is active:
 *
 *    configure(function(){
 *      // ...
 *    })
 *
 * Environment specific configuration:
 *
 *    configure('development', function(){
 *      // ...
 *    })
 *
 * Running configurations:
 * 
 *    configure('development')
 *
 * @param  {string, function} environment
 * @param  {function} fn
 * @api public
 */

exports.configure = function(environment, fn) {
  if (environment instanceof Function)
    fn = environment, environment = 'all'
  if (fn instanceof Function)
    return Express.config.push([environment, fn])
  if (typeof environment != 'string')
    throw 'environment require'
  for (var i = 0, len = Express.config.length; i < len; ++i)
    if (Express.config[i][0] == environment ||
        Express.config[i][0] == 'all')
          Express.config[i][1].call(Express)
}

// --- Routing API

exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')