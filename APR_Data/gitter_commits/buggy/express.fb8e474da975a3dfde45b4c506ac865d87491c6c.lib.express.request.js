
// Express - Request - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * StaticFile for Request#sendfile()
 */

var StaticFile = require('express/static').File

/**
 * Default response code bodies.
 */

var statusBodies = require('http').STATUS_CODES

// --- InvalidStatusCode

InvalidStatusCode = ExpressError.extend({
  name: 'InvalidStatusCode',
  init: function(status) {
    this.message = status + ' is an invalid HTTP response code'
  }
})

// --- InvalidResponseBody

InvalidResponseBody = ExpressError.extend({
  name: 'InvalidResponseBody',
  init: function(request) {
    this.message = request.method + ' ' + JSON.encode(request.uri.path) + ' did not respond with a body string'
  }
})

// --- Helpers

/**
 * Normalize the given _path_.
 * Strips trailing slashes and whitespace.
 *
 * @param  {string} path
 * @return {string}
 * @api public
 */

exports.normalizePath = function(path) {
  return path.replace(/[\s\/]*$/g, '')
}

// --- Request

exports.Request = Class({
  
  /**
   * Initialize with node's _request_ and _response_ objects.
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  init: function(request, response) {
    process.mixin(true, this, request)
    response.headers = {}
    this.response = response
    this.uri.path = exports.normalizePath(this.uri.path)
    this.params = { 
      get: parseNestedParams(this.uri.params), 
      post: {}, 
      path: {}
    }
    this.plugins = $(Express.plugins).map(function(plugin){
      return new plugin.klass(plugin.options) 
    })
  },
  
  /**
   * Set response header _key_ and _val_ or get
   * request header value by _key_.
   *
   * @param  {string} key
   * @param  {string} val
   * @return {string}
   * @api public
   */

  header: function(key, val) {
    return val === undefined ?
      this.headers[key.toLowerCase()] :
        this.response.headers[key.toLowerCase()] = val
  },
  
  /**
   * Return a param _key_ value or null.
   *
   *  - Checks route populated path parameters
   *  - Checks POST parameters
   *  - Checks GET parameters
   *
   * @param  {string} key
   * @return {string}
   * @api public
   */

  param: function(key) {
    return this.params.get[key] ||
           this.params.post[key] ||
           this.params.path[key]
  },
  
  /**
   * Check if Accept header includes the mime type
   * for the given _path_, which calls mime().
   *
   * When no Accept header is present true will be
   * returned as stated in the HTTP specification.
   *
   * @param  {string} path
   * @return {bool}
   * @see mime()
   * @api public
   */

  accepts: function(path) {
    return this.header('accept') ? 
      this.header('accept').indexOf(mime(path)) !== -1 :
        true
  },

  /**
   * Set response status to _code_.
   *
   * @param  {int} code
   * @return {int}
   * @api public
   */

  status: function(code) {
    return this.response.status = code
  },
  
  /**
   * Immediately respond with response _code_, _body_ and optional _encoding_.
   * The status _code_ defaults to to 404, and _body_ will
   * default to the default body associated with the response
   * _code_.
   *
   * When an invalid status _code_ is passed, InvalidStatusCode
   * will be thrown.
   *
   * @param  {int} code
   * @param  {string} body
   * @param  {string} encoding
   * @see statusBodies
   * @api public
   */

  halt: function(code, body, encoding) {
    this.status(code = code || 404)
    if (body = body || statusBodies[code])
      return this.respond(body, encoding)
    throw new InvalidStatusCode(code)
  },
  
  /**
   * Respond with _body_ and optional _encoding_.
   *
   * @param  {string} body
   * @param  {string} encoding
   * @see Request#halt()
   * @api private
   */
  
  respond: function(body, encoding) {
    this.response.body = body
    this.trigger('response')
    if (typeof this.response.body != 'string') throw new InvalidResponseBody(this)
    if (typeof this.response.status != 'number') throw new InvalidStatusCode(this.response.status)
    this.response.sendHeader(this.response.status, this.response.headers)
    this.response.sendBody(this.response.body, encoding)
    this.response.finish()
  },
  
  /**
   * Set Content-Type header to the mime type
   * for the given _path_, which calls mime().
   *
   * @param  {string} path
   * @see mime()
   * @api public
   */

  contentType: function(path) {
    this.header('content-type', mime(path))
  },
  
  /**
   * Trigger even _name_ with optional _data_.
   *
   * @param  {string} name
   * @param  {hash} data
   * @api public
   */

  trigger: function(name, data) {
    data = process.mixin(data || {}, {
      request: this,
      response: this.response
    })
    this.plugins.each(function(plugin){
      plugin.trigger(new Event(name, data))
    })
  },
  
  /**
   * Transfer static file at the given _path_ as an attachment.
   *
   * @param  {string} path
   * @api public
   */
  
  download: function(path) {
    this.attachment(path)
    this.sendfile(path)
  },
  
  /**
   * Set Content-Disposition header to 'attachment',
   * with optional file _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  attachment: function(path) {
    this.header('content-disposition', path ? 
       'attachment; filename="' + path + '"' :
         'attachment')
  },
  
  /**
   * Transfer static file at the given _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  sendfile: function(path) {
    (new StaticFile(path)).send(this)
  }
})