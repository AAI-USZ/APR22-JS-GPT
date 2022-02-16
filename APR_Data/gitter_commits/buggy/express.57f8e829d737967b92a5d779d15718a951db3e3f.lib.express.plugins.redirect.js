
// Express - Redirect - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Request

Request.include({
  
  /**
   * Redirect to _uri_ with optional status _code_,
   * defaulting to 302. 
   *
   * When using redirect('home') the resolution
   * is as follows:
   *
   *  - set('home')
   *  - set('basepath')
   *  - '/'
   *
   * When using redirect('back') the HTTP referrer
   * header is used. Commonly misspelled as 'referer'
   * which is supported as well.
   *
   * @param  {string} uri
   * @settings 'home', 'basepath'
   * @api public
   */

  redirect: function(uri, code) {
    if (uri == 'back' || uri == 'home') uri = this[uri]
    this.header('location', uri)
    this.halt(code || 302)
  }  
})

// --- Expose

process.mixin(GLOBAL, exports)

// --- Redirect

exports.Redirect = Plugin.extend({
  on: {
    request: function(event) {
      event.request.home = set('home') || set('basepath') || '/'
      event.request.back = event.request.header('referrer') || event.request.header('referer')
    }
  }
})