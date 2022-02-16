
/*!
 * Express - response
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , connect = require('connect')
  , utils = connect.utils
  , statusCodes = http.STATUS_CODES
  , send = connect.static.send
  , mime = require('mime')
  , basename = path.basename
  , join = path.join;

/**
 * Response prototype.
 */

var res = module.exports = {
  __proto__: http.ServerResponse.prototype
};

/**
 * Set status `code`.
 *
 * @param {Number} code
 * @return {ServerResponse}
 * @api public
 */

res.status = function(code){
  this.statusCode = code;
  return this;
};

/**
 * Set Cache-Control to the given `type` and `options`.
 *
 * Options:
 *
 *  - `maxAge` in milliseconds
 *
 * @param {String} type
 * @param {Object} options
 * @return {ServerResponse}
 * @api public
 */

res.cache = function(type, options){
  var val = type;
  options = options || {};
  if (options.maxAge) val += ', max-age=' + (options.maxAge / 1000); 
  return this.set('Cache-Control', val);
};

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(new Buffer('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *     res.send(404, 'Sorry, cant find that');
 *     res.send(404);
 *
 * @param {Mixed} body or status
 * @param {Mixed} body
 * @return {ServerResponse}
 * @api public
 */

res.send = function(body){
  var req = this.req
    , head = 'HEAD' == req.method;

  // allow status / body
  if (2 == arguments.length) {
    this.statusCode = body;
    body = arguments[1];
  }

  switch (typeof body) {
    // response status
    case 'number':
      this.header('Content-Type') || this.contentType('.txt');
      this.statusCode = body;
      body = http.STATUS_CODES[body];
      break;
    // string defaulting to html
    case 'string':
      if (!this.header('Content-Type')) {
        this.charset = this.charset || 'utf-8';
        this.contentType('.html');
      }
      break;
    case 'boolean':
    case 'object':
      if (null == body) {
        body = '';
      } else if (Buffer.isBuffer(body)) {
        this.header('Content-Type') || this.contentType('.bin');
      } else {
        return this.json(body);
      }
      break;
  }

  // populate Content-Length
  if (undefined !== body && !this.header('Content-Length')) {
    this.header('Content-Length', Buffer.isBuffer(body)
      ? body.length
      : Buffer.byteLength(body));
  }

  // strip irrelevant headers
  if (204 == this.statusCode || 304 == this.statusCode) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    body = '';
  }

  // respond
  this.end(head ? null : body);
  return this;
};

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *     res.json(500, 'oh noes!');
 *     res.json(404, 'I dont have that');
 *
 * @param {Mixed} obj or status
 * @param {Mixed} obj
 * @return {ServerResponse}
 * @api public
 */

res.json = function(obj){
  // allow status / body
  if (2 == arguments.length) {
    this.statusCode = obj;
    obj = arguments[1];
  }

  var settings = this.app.settings
    , jsonp = settings['jsonp callback']
    , replacer = settings['json replacer']
    , spaces = settings['json spaces']
    , body = JSON.stringify(obj, replacer, spaces)
    , callback = this.req.query.callback;

  this.charset = this.charset || 'utf-8';
  this.header('Content-Type', 'application/json');

  if (callback && jsonp) {
    this.header('Content-Type', 'text/javascript');
    body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
  }

  return this.send(body);
};

/**
 * Transfer the file at the given `path`.
 * 
 * Automatically sets the _Content-Type_ response header field.
 * The callback `fn(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.sentHeader`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge` defaulting to 0
 *   - `root`   root directory for relative filenames
 *
 * @param {String} path
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @api public
 */

res.sendfile = function(path, options, fn){
  var self = this
    , req = self.req
    , next = this.req.next
    , options = options || {};

  // support function as second arg
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // callback
  options.callback = function(err){
    if (err) {
      // cast ENOENT
      if ('ENOENT' == err.code) err = 404;

      // coerce numeric error to an Error
      // TODO: remove
      // TODO: remove docs for headerSent?
      if ('number' == typeof err) err = utils.error(err);

      // ditch content-disposition to prevent funky responses
      if (!self.headerSent) self.removeHeader('Content-Disposition');

      // woot! callback available
      if (fn) return fn(err);

      // lost in limbo if there's no callback
      if (self.headerSent) return;

      return req.next(err);
    }

    fn && fn();
  };

  // transfer
  options.path = encodeURIComponent(path);
  send(this.req, this, next, options);
};

/**
 * Transfer the file at the given `path` as an attachment.
 *
 * Optionally providing an alternate attachment `filename`,
 * and optional callback `fn(err)`. The callback is invoked
 * when the data transfer is complete, or when an error has
 * ocurred. Be sure to check `res.headerSent` if you plan to respond.
 *
 * @param {String} path
 * @param {String|Function} filename or fn
 * @param {Function} fn
 * @api public
 */

res.download = function(path, filename, fn){
  // support function as second arg
  if ('function' == typeof filename) {
    fn = filename;
    filename = null;
  }

  return this.attachment(filename || path).sendfile(path, fn);
};

/**
 * Set _Content-Type_ response header passed through `mime.lookup()`.
 *
 * Examples:
 *
 *     var filename = 'path/to/image.png';
 *     res.contentType(filename);
 *     // res.headers['Content-Type'] is now "image/png"
 *
 *     res.contentType('.html');
 *     res.contentType('html');
 *     res.contentType('json');
 *     res.contentType('png');
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @api public
 */

res.contentType =
res.type = function(type){
  return this.header('Content-Type', mime.lookup(type));
};

/**
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @api public
 */

res.attachment = function(filename){
  if (filename) this.type(filename);
  this.header('Content-Disposition', filename
    ? 'attachment; filename="' + basename(filename) + '"'
    : 'attachment');
  return this;
};

/**
 * Set header `field` to `val`, or pass
 * an object of of header fields.
 *
 * Examples:
 *
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.set = function(field, val){
  if (2 == arguments.length) {
    this.setHeader(field, val);
  } else {
    for (var key in field) {
      this.setHeader(key, field[key]);
    }
  }
  return this;
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

res.get = function(field){
  return this.getHeader(field);
};

/**
 * Set or get response header `field` with optional `val`.
 *
 * @param {String} name
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.header = function(field, val){
  if (1 == arguments.length) return this.getHeader(field);
  this.setHeader(field, val);
  return this;
};

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} options
 * @param {ServerResponse} for chaining
 * @api public
 */

res.clearCookie = function(name, options){
  var opts = { expires: new Date(1), path: '/' };
  return this.cookie(name, '', options
    ? utils.merge(opts, options)
    : opts);
};

/**
 * Set a signed cookie with the given `name` and `val`.
 * See `res.cookie()` for details.
 *
 * @param {String} name
 * @param {String|Object} val
 * @param {Object} options
 * @api public
 */

res.signedCookie = function(name, val, options){
  var secret = this.req.secret;
  if (!secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
  if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
  val = utils.sign(val, secret);
  return this.cookie(name, val, options);
};

/**
 * Set cookie `name` to `val`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `path`     defaults to "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // save as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String|Object} val
 * @param {Options} options
 * @api public
 */

res.cookie = function(name, val, options){
  options = options || {};
  if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
  if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
  if (null == options.path) options.path = '/';
  var cookie = utils.serializeCookie(name, val, options);
  this.header('Set-Cookie', cookie);
  return this;
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The given `url` can also be the name of a mapped url, for
 * example by default express supports "back" which redirects
 * to the _Referrer_ or _Referer_ headers or "/".
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *
 * Mounting:
 *
 *   When an application is mounted, and `res.redirect()`
 *   is given a path that does _not_ lead with "/". For 
 *   example suppose a "blog" app is mounted at "/blog",
 *   the following redirect would result in "/blog/login":
 *
 *      res.redirect('login');
 *
 *   While the leading slash would result in a redirect to "/login":
 *
 *      res.redirect('/login');
 *
 * @param {String} url
 * @param {Number} code
 * @api public
 */

res.redirect = function(url){
  var app = this.app
    , req = this.req
    , head = 'HEAD' == req.method
    , status = 302
    , body;

  // allow status / url
  if (2 == arguments.length) {
    status = url;
    url = arguments[1];
  }

  // setup redirect map
  var map = { back: req.header('Referrer', '/') };

  // perform redirect
  url = map[url] || url;

  // relative
  if (!~url.indexOf('://')) {
    var path = app.path();

    // relative to path
    if (0 == url.indexOf('./') || 0 == url.indexOf('..')) {
      url = req.path + '/' + url;
    // relative to mount-point
    } else if ('/' != url[0]) {
      url = path + '/' + url;
    }

    // Absolute
    var host = req.header('Host');
    url = req.protocol + '://' + host + url;
  }

  // Support text/{plain,html} by default
  if (req.accepts('html')) {
    body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
    this.header('Content-Type', 'text/html');
  } else {
    body = statusCodes[status] + '. Redirecting to ' + url;
    this.header('Content-Type', 'text/plain');
  }

  // Respond
  this.statusCode = status;
  this.header('Location', url);
  this.end(head ? null : body);
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  - `status`    Response status code (`res.statusCode`)
 *  - `charset`   Set the charset (`res.charset`)
 *
 * Reserved locals:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

res.render = function(view, options, fn){
  var self = this
    , options = options || {}
    , req = this.req
    , app = req.app;

  // support callback function as second arg
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  function render() {
    // merge res.locals
    options.locals = self.locals;

    // default callback to respond
    fn = fn || function(err, str){
      if (err) return req.next(err);
      self.send(str);
    };

    // render
    app.render(view, options, fn);
  }

  // invoke view callbacks
  var callbacks = app.viewCallbacks
    , pending = callbacks.length
    , len = pending
    , done;

  if (len) {
    for (var i = 0; i < len; ++i) {
      callbacks[i](req, self, function(err){
        if (done) return;

        if (err) {
          req.next(err);
          done = true;
          return;
        }

        --pending || render();
      });
    }
  } else {
    render();
  }
};