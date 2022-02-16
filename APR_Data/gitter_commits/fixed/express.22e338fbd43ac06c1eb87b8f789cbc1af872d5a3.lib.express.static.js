
// Express - Static - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

var path = require('path'),
    posix = require('posix')
    
// --- InvalidPathError

InvalidPathError = ExpressError.extend({
  name: 'InvalidPathError',
  init: function(path) {
    this.message = "`" + path + "' is not a valid path"
  }
})  
  
// --- File

exports.File = Class({
  
  /**
   * Initialize with file _path_.
   *
   * @param  {string} path
   * @api public
   */
  
  init: function(path) {
    this.path = path
    if (path.indexOf('..') != -1) throw new InvalidPathError(path)
  },
  
  /**
   * Transfer static file to the given _request_.
   *
   *  - Ensures the file exists
   *  - Ensures the file is a regular file (not FIFO, Socket, etc)
   *  - Automatically assigns content type
   *
   * @param  {Request} request
   * @api public
   */
  
  send: function(request) {
    var file = this.path
    path.exists(file, function(exists){
      if (!exists) request.halt()
      posix.stat(file).addCallback(function(stats){
        if (!stats.isFile()) request.halt()
        posix.cat(file, "binary").addCallback(function(content){
          request.contentType(file)
          request.status(200)
          request.response.body = content
          request.trigger('response')
          request.response.sendHeader(request.response.status, request.response.headers)
          request.response.sendBody(request.response.body, 'binary')
          request.response.finish()
        })
      })
    })
  }
})