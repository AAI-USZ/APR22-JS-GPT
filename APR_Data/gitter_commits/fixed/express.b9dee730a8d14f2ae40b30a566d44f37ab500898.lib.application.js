
/*!
 * Express - proto
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect')
  , Router = require('./router')
  , toArray = require('./utils').toArray
  , methods = Router.methods.concat('del', 'all')
  , res = require('./response')
  , View = require('./view')
  , url = require('url')
  , utils = connect.utils
  , path = require('path')
  , join = path.join
  , fs = require('fs')
  , qs = require('qs');

/**
 * Expose `HTTPServer`.
 */

var app = exports = module.exports = {};

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 *   - setup route reflection methods
 *
 * @api private
 */

app.init = function(){
  var self = this;
  this.cache = {};
  this.settings = {};
  this.engines = {};
  this.redirects = {};
  this.isCallbacks = {};
  this.viewCallbacks = [];
  this.defaultConfiguration();

  // route reflection methods
  methods.forEach(function(method){
    self.lookup[method] = function(path){
      return self._router.lookup(method, path);
    };

    self.match[method] = function(path){
      return self._router.match(method, path);
    };

    self.remove[method] = function(path){
      return self._router.lookup(method, path).remove();
    };
  });

  // del -> delete
  self.lookup.del = self.lookup.delete;
  self.match.del = self.match.delete;
  self.remove.del = self.remove.delete;
};

/**
 * Initialize application configuration.
 *
 * @api private
 */

app.defaultConfiguration = function(){
  var self = this;

  // default settings
  this.set('root', '/');
  this.set('env', process.env.NODE_ENV || 'development');

  // always parse req.query
  this.use(connect.query());

  this.locals = function(obj){
    for (var key in obj) self.locals[key] = obj[key];
    return self;
  };

  this.locals.use = function(fn){
    if (3 == fn.length) {
      self.viewCallbacks.push(fn);
    } else {
      self.viewCallbacks.push(function(req, res, done){
        fn(req, res);
        done();
      });
    }
    return this;
  };

  // expose objects to each other
  this.use(function(req, res, next){
    var charset;
    res.setHeader('X-Powered-By', 'Express');
    req.app = res.app = self;
    req.res = res;
    res.req = req;
    req.next = next;

    res.locals = function(obj){
      for (var key in obj) res.locals[key] = obj[key];
      return res;
    };

    next();
  });

  // router
  this._router = new Router(this);
  this.routes = this._router.routes;
  this.__defineGetter__('router', function(){
    this.__usedRouter = true;
    return self._router.middleware;
  });

  // default locals
  this.locals.settings = this.settings;

  // default production configuration
  this.configure('production', function(){
    this.enable('view cache');
  });
};

/**
 * Remove routes matching the given `path`.
 *
 * @param {Route} path
 * @return {Boolean}
 * @api public
 */

app.remove = function(path){
  return this._router.lookup('all', path).remove();
};

/**
 * Lookup routes defined with a path
 * equivalent to `path`.
 *
 * @param {Stirng} path
 * @return {Array}
 * @api public
 */

app.lookup = function(path){
  return this._router.lookup('all', path);
};

/**
 * Lookup routes matching the given `url`.
 *
 * @param {Stirng} url
 * @return {Array}
 * @api public
 */

app.match = function(url){
  return this._router.match('all', url);
};

/**
 * Proxy `connect#use()` to apply settings to
 * mounted applications.
 *
 * @param {String|Function|Server} route
 * @param {Function|Server} middleware
 * @return {Server} for chaining
 * @api public
 */

app.use = function(route, middleware){
  var app, home, handle;

  if ('string' != typeof route) {
    middleware = route, route = '/';
  }

  // express app
  if (middleware.handle && middleware.set) app = middleware;

  // restore .app property on req and res
  if (app) {
    app.route = route;
    middleware = function(req, res, next) {
      var orig = req.app;
      app.handle(req, res, function(err){
        req.app = res.app = orig;
        next(err);
      });
    };
  }

  connect.proto.use.call(this, route, middleware);

  // mounted an app, invoke the hook
  // and adjust some settings
  if (app) {
    var root = this.get('root') || this.route;
    if ('/' == root) root = '';
    root = root + (app.get('root') || app.route);
    app.set('root', root);
    app.parent = this;
    if (app.__mounted) app.__mounted.call(app, this);
  }

  return this;
};

/**
 * Assign a callback `fn` which is called
 * when this `Server` is passed to `Server#use()`.
 *
 * Examples:
 *
 *    var app = express.createServer()
 *      , blog = express.createServer();
 *
 *    blog.mounted(function(parent){
 *      // parent is app
 *      // "this" is blog
 *    });
 *
 *    app.use(blog);
 *
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.mounted = function(fn){
  this.__mounted = fn;
  return this;
};

/**
 * Register the given template engine callback `fn`
 * as `ext`. For example we may wish to map ".html"
 * files to ejs rather than using the ".ejs" extension.
 *
 *    app.engine('.html', require('ejs').render);
 *
 * or
 *
 *    app.engine('html', require('ejs').render);
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.engine = function(ext, fn){
  if ('.' != ext[0]) ext = '.' + ext;
  this.engines[ext] = fn;
  return this;
};

/**
 * Map the given param placeholder `name`(s) to the given callback(s).
 *
 * Param mapping is used to provide pre-conditions to routes
 * which us normalized placeholders. This callback has the same
 * signature as regular middleware, for example below when ":userId"
 * is used this function will be invoked in an attempt to load the user.
 *
 *      app.param('userId', function(req, res, next, id){
 *        User.find(id, function(err, user){
 *          if (err) {
 *            next(err);
 *          } else if (user) {
 *            req.user = user;
 *            next();
 *          } else {
 *            next(new Error('failed to load user'));
 *          }
 *        });
 *      });
 *
 * Passing a single function allows you to map logic
 * to the values passed to `app.param()`, for example
 * this is useful to provide coercion support in a concise manner.
 *
 * The following example maps regular expressions to param values
 * ensuring that they match, otherwise passing control to the next
 * route:
 *
 *      app.param(function(name, regexp){
 *        if (regexp instanceof RegExp) {
 *          return function(req, res, next, val){
 *            var captures;
 *            if (captures = regexp.exec(String(val))) {
 *              req.params[name] = captures;
 *              next();
 *            } else {
 *              next('route');
 *            }
 *          }
 *        }
 *      });
 *
 * We can now use it as shown below, where "/commit/:commit" expects
 * that the value for ":commit" is at 5 or more digits. The capture
 * groups are then available as `req.params.commit` as we defined
 * in the function above.
 *
 *    app.param('commit', /^\d{5,}$/);
 *
 * For more of this useful functionality take a look
 * at [express-params](http://github.com/visionmedia/express-params).
 *
 * @param {String|Array|Function} name
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.param = function(name, fn){
  var self = this
    , fns = [].slice.call(arguments, 1);

  // array
  if (Array.isArray(name)) {
    name.forEach(function(name){
      fns.forEach(function(fn){
        self.param(name, fn);
      });
    });
  // param logic
  } else if ('function' == typeof name) {
    this._router.param(name);
  // single
  } else {
    if (':' == name[0]) name = name.substr(1);
    fns.forEach(function(fn){
      self._router.param(name, fn);
    });
  }

  return this;
};

/**
 * Register the given callback `fn` for the given `type`.
 *
 * @param {String} type
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.is = function(type, fn){
  if (!fn) return this.isCallbacks[type];
  this.isCallbacks[type] = fn;
  return this;
};

/**
 * Assign `setting` to `val`, or return `setting`'s value.
 * Mounted servers inherit their parent server's settings.
 *
 * @param {String} setting
 * @param {String} val
 * @return {Server|Mixed} for chaining, or the setting value
 * @api public
 */

app.set = function(setting, val){
  if (val === undefined) {
    if (this.settings.hasOwnProperty(setting)) {
      return this.settings[setting];
    } else if (this.parent) {
      return this.parent.set(setting);
    }
  } else {
    this.settings[setting] = val;
    return this;
  }
};

/**
 * Check if `setting` is enabled.
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.enabled = function(setting){
  return !!this.set(setting);
};

/**
 * Check if `setting` is disabled.
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.disabled = function(setting){
  return !this.set(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

app.enable = function(setting){
  return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

app.disable = function(setting){
  return this.set(setting, false);
};

/**
 * Redirect `key` to `url`.
 *
 * @param {String} key
 * @param {String} url
 * @return {Server} for chaining
 * @api public
 */

app.redirect = function(key, url){
  this.redirects[key] = url;
  return this;
};

/**
 * Configure callback for zero or more envs,
 * when no env is specified that callback will
 * be invoked for all environments. Any combination
 * can be used multiple times, in any order desired.
 *
 * Examples:
 *
 *    app.configure(function(){
 *      // executed for all envs
 *    });
 *
 *    app.configure('stage', function(){
 *      // executed staging env
 *    });
 *
 *    app.configure('stage', 'production', function(){
 *      // executed for stage and production
 *    });
 *
 * @param {String} env...
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.configure = function(env, fn){
  var envs = 'all'
    , args = toArray(arguments);
  fn = args.pop();
  if (args.length) envs = args;
  if ('all' == envs || ~envs.indexOf(this.settings.env)) fn.call(this);
  return this;
};

/**
 * Delegate `.VERB(...)` calls to `.route(VERB, ...)`.
 */

methods.forEach(function(method){
  app[method] = function(path){
    if ('get' == method && 1 == arguments.length) return this.set(path); 
    var args = [method].concat(toArray(arguments));
    if (!this.__usedRouter) this.use(this._router);
    return this._router._route.apply(this._router, args);
  }
});

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {Server} for chaining
 * @api public
 */

app.all = function(path){
  var args = arguments;
  methods.forEach(function(method){
    if ('all' == method) return;
    app[method].apply(this, args);
  }, this);
  return this;
};

// del -> delete alias

app.del = app.delete;

/**
 * Render the given view `name` name with `options`
 * and a callback accepting an error and the
 * rendered template string.
 *
 * @param {String} name
 * @param {String|Function} options or fn
 * @param {Function} fn
 * @api public
 */

app.render = function(name, options, fn){
  var self = this
    , opts = {}
    , cache = this.cache
    , engines = this.engines
    , view;

  // support callback function as second arg
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  // merge app.locals
  utils.merge(opts, this.locals);

  // merge options.locals
  if (options.locals) {
    utils.merge(opts, options.locals);
    delete opts.locals;
  }

  // merge options
  utils.merge(opts, options);

  // set .cache unless explicitly provided
  opts.cache = null == opts.cache
    ? this.enabled('view cache')
    : opts.cache;

  // primed cache
  if (opts.cache) view = cache[name];

  // view
  if (!view) {
    view = new View(name, {
        defaultEngine: this.get('view engine')
      , root: this.get('views') || process.cwd() + '/views'
      , engines: engines
    });

    // prime the cache
    if (opts.cache) cache[name] = view;
  }

  // render
  try {
    view.render(opts, fn);
  } catch (err) {
    fn(err);
  }
};
