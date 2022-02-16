/**
 * Module dependencies.
 */

var Route = require('./route')
  , utils = require('../utils')
  , methods = require('methods')
  , debug = require('debug')('express:router')
  , parseUrl = utils.parseUrl;

/**
 * Expose `Router` constructor.
 */

exports = module.exports = Router;

/**
 * Initialize a new `Router` with the given `options`.
 *
 * @param {Object} options
 * @api private
 */

function Router(options) {
  options = options || {};
  var self = this;

  self.params = {};
  self._params = [];
  self.caseSensitive = options.caseSensitive;
  self.strict = options.strict;
  self.stack = [];

  self.middleware = self.handle.bind(self);
}

/**
 * Map the given param placeholder `name`(s) to the given callback.
 *
 * Parameter mapping is used to provide pre-conditions to routes
 * which use normalized placeholders. For example a _:user_id_ parameter
 * could automatically load a user's information from the database without
 * any additional code,
 *
 * The callback uses the same signature as middleware, the only difference
 * being that the value of the placeholder is passed, in this case the _id_
 * of the user. Once the `next()` function is invoked, just like middleware
 * it will continue on to execute the route, or subsequent parameter functions.
 *
 * Just like in middleware, you must either respond to the request or call next
 * to avoid stalling the request.
 *
 *  app.param('user_id', function(req, res, next, id){
 *    User.find(id, function(err, user){
 *      if (err) {
 *        return next(err);
 *      } else if (!user) {
 *        return next(new Error('failed to load user'));
 *      }
 *      req.user = user;
 *      next();
 *    });
 *  });
 *
 * @param {String} name
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

Router.prototype.param = function(name, fn){
  // param logic
  if ('function' == typeof name) {
    this._params.push(name);
    return;
  }

  // apply param functions
  var params = this._params
    , len = params.length
    , ret;

  if (name[0] === ':') {
    name = name.substr(1);
  }

  for (var i = 0; i < len; ++i) {
    if (ret = params[i](name, fn)) {
      fn = ret;
    }
  }

  // ensure we end up with a
  // middleware function
  if ('function' != typeof fn) {
    throw new Error('invalid param() call for ' + name + ', got ' + fn);
  }

  (this.params[name] = this.params[name] || []).push(fn);
  return this;
};

/**
 * Dispatch a req, res into the router.
 *
 * @api private
 */

Router.prototype.handle = function(req, res, done) {
  var self = this;

  debug('dispatching %s %s', req.method, req.url);

  var method = req.method.toLowerCase();

  var search = 1 + req.url.indexOf('?');
  var pathlength = search ? search - 1 : req.url.length;
  var fqdn = 1 + req.url.substr(0, pathlength).indexOf('://');
  var protohost = fqdn ? req.url.substr(0, req.url.indexOf('/', 2 + fqdn)) : '';
  var idx = 0;
  var removed = '';
  var slashAdded = false;

  // store options for OPTIONS request
  // only used if OPTIONS request
  var options = [];

  // middleware and routes
  var stack = this.stack;

  // for options requests, respond with a default if nothing else responds
  if (method === 'options') {
    var old = done;
    done = function(err) {
      if (err || options.length === 0) return old(err);

      var body = options.join(',');
      return res.set('Allow', body).send(body);
    };
  }

  (function next(err) {
    if (err === 'route') {
      err = undefined;
    }

    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (slashAdded) {
      req.url = req.url.substr(1);
      slashAdded = false;
    }

    req.url = protohost + removed + req.url.substr(protohost.length);
    req.originalUrl = req.originalUrl || req.url;
    removed = '';

    try {
      var path = parseUrl(req).pathname;
      if (undefined == path) path = '/';

      // route object and not middleware
      var route = layer.route;

      // handle route
      if (route) {
        // we don't run any routs with error first
        if (err || !route.match(path)) {
          return next(err);
        }

        req.params = route.params;

        // we can now dispatch to the route
        if (method === 'options' && !route.methods['options']) {
          options.push.apply(options, route._options());
        }

        return self.process_params(route, req, res, function(err) {
          if (err) {
            return next(err);
          }

          route.dispatch(req, res, next);
        });
      }

      // skip this layer if the path doesn't match.
      if (0 != path.toLowerCase().indexOf(layer.path.toLowerCase())) return next(err);

      var c = path[layer.path.length];
      if (c && '/' != c && '.' != c) return next(err);

      // Trim off the part of the url that matches the route
      // middleware (.use stuff) needs to have the path stripped
      debug('trim prefix (%s) from url %s', removed, req.url);
      removed = layer.path;
      req.url = protohost + req.url.substr(protohost.length + removed.length);

      // Ensure leading slash
      if (!fqdn && '/' != req.url[0]) {
        req.url = '/' + req.url;
        slashAdded = true;
      }

      debug('%s %s : %s', layer.handle.name || 'anonymous', layer.path, req.originalUrl);
      var arity = layer.handle.length;
      if (err) {
        if (arity === 4) {
          layer.handle(err, req, res, next);
        } else {
          next(err);
        }
      } else if (arity < 4) {
        layer.handle(req, res, next);
      } else {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  })();
};

/**
 * Process any parameters for the route.
 *
 * @api private
 */

Router.prototype.process_params = function(route, req, res, done) {
  var self = this;
  var params = this.params;

  // captured parameters from the route, keys and values
  var keys = route.keys || [];

  var i = 0;
  var paramIndex = 0;
  var key;
  var paramVal;
  var paramCallbacks;

  // process params in order
  // param callbacks can be async
  function param(err) {
    if (err) {
      return done(err);
    }

    if (i >= keys.length ) {
      return done();
    }

    paramIndex = 0;
    key = keys[i++];
    paramVal = key && req.params[key.name];
    paramCallbacks = key && params[key.name];

    try {
      if (paramCallbacks && undefined !== paramVal) {
        return paramCallback();
      } else if (key) {
        return param();
      }
    } catch (err) {
      done(err);
    }

    done();
  };

  // single param callbacks
  function paramCallback(err) {
    var fn = paramCallbacks[paramIndex++];
    if (err || !fn) return param(err);
    fn(req, res, paramCallback, paramVal, key.name);
  }

  param();
};

/**
 * Use the given middleware function, with optional path, defaulting to "/".
 *
 * Use (like `.all`) will run for any http METHOD, but it will not add
 * handlers for those methods so OPTIONS requests will not consider `.use`
 * functions even if they could respond.
 *
 * The other difference is that _route_ path is stripped and not visible
 * to the handler function. The main effect of this feature is that mounted
 * handlers can operate without any code changes regardless of the "prefix"
 * pathname.
 *
 * @param {String|Function} route
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

Router.prototype.use = function(route, fn){

  // default route to '/'
  if ('string' != typeof route) {
    fn = route;
    route = '/';
  }

  // strip trailing slash
  if ('/' == route[route.length - 1]) {
    route = route.slice(0, -1);
  }

  // add the middleware
  debug('use %s %s', route || '/', fn.name || 'anonymous');
  this.stack.push({ path: route, handle: fn });

  return this;
};

/**
 * Create a new Route for the given path.
 *
 * Each route contains a separate middleware stack and VERB handlers.
 *
 * See the Route api documentation for details on adding handlers
 * and middleware to routes.
 *
 * @param {String} path
 * @return {Route}
 * @api public
 */

Router.prototype.route = function(path){
  var route = new Route(path, {
    sensitive: this.caseSensitive,
    strict: this.strict
  });

  this.stack.push({ path: path, route: route });
  return route;
};

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {app} for chaining
 * @api public
 */

Router.prototype.all = function(path, fn) {
  var route = this.route(path);
  methods.forEach(function(method){
    route[method](fn);
  });
};

// create Router#VERB functions
methods.forEach(function(method){
  Router.prototype[method] = function(path, fn){
    var self = this;
    self.route(path)[method](fn);
    return self;
  };
});
