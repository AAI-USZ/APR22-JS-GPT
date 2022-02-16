
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// DEPRECATED: remove in 0.9.0

/**
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs')
    
// --- File

exports.File = new Class({
  
  /**
   * Initialize with file _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  constructor: function(path) {
    Ext.warn('require("express/static").File is deprecated, use require("express/plugins/static").File')
    this.path = path
    if (path.indexOf('..') != -1)
      Error.raise('InvalidPathError', "`" + path + "' is not a valid path")
  },
  
  /**
   * Transfer static file to the given _request_.
   *
   *  - Ensures the file exists
   *  - Ensures the file is a regular file (not FIFO, Socket, etc)
   *  - Automatically assigns content type
   *  - Halts with 404 when failing
   *
   * @param  {Request} request
   * @settings 'cache static files'
   * @api public
   */
  
  send: function(request) {
    var cache, file = this.path
    if (set('cache static files') && (cache = request.cache.get(file)))
      return request.contentType(cache.type),
             request.halt(200, cache.content, 'binary')
    path.exists(file, function(exists){
      if (!exists) return request.halt()
      fs.stat(file, function(err, stats){
        if (err) throw err
        if (!stats.isFile()) return request.halt()
        fs.readFile(file, 'binary', function(err, content){
          if (err) throw err
          request.contentType(file)
          if (set('cache static files'))
            request.cache.set(file, { type: file, content: content })
          request.halt(200, content, 'binary')
        })
      })
    })
  }
})