
// Express - Cache - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

// --- Cache

var Cache = new Class({
  
  /**
   * Initialize cache with _key_ and _val_.
   */
  
  constructor: function(key, val) {
    this.key = key
    this.val = val
    this.created = Number(new Date)
  }
})

// --- Store

exports.Store = new Class({
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @param  {string} val
   * @param  {function} fn
   * @api public
   */
  
  set: function(key, val, fn) {
    if (typeof key !== 'string')
      throw new Error(this.name + ' store #set() key must be a string')
  },
  
  /**
   * Ensure that the given _key_ is a string.
   * Override in subclass to provide data-store specific functionality.
   *
   * @param  {string} key
   * @param  {function} fn
   * @api public
   */
  
  get: function(key, fn) {
    if (typeof key !== 'string')
      throw new Error(this.name + 'store #get() key must be a string')
  },
  
  /**
   * Convert to '[NAME Store]'.
   *
   * @return {string}
   * @api public
   */
  
  toString: function() {
    return '[' + this.name + ' Store]'
  }
})

// --- Store.Memory

exports.Store.Memory = exports.Store.extend({
  
  /**
   * Datastore name.
   */
  
  name: 'Memory',
  
  /**
   * Initialize data.
   */
  
  constructor: function() {
    this.data = {}
  },
  
  /**
   * Set the given _key_ to _val_.
   *
   * @param  {string} key
   * @param  {string} val
   * @param  {function} fn
   * @return {string}
   * @api public
   */
  
  set: function(key, val, fn) {
    exports.Store.prototype.set.apply(this, arguments)
    this.data[key] = new Cache(key, val)
    if (fn instanceof Function) fn(val)
  },
  
  /**
   * Get data found matching the given _key_.
   *
   * Examples:
   *
   *   cache.get('page:front', function(val){})
   *   // => '<html>...</html>'
   *
   *   cache.get('page:*', function(vals){})
   *   // => { 'page:front': '<html>...</html>', 
   *           'page:users': '<html>...</html>',
   *            ... }
   *
   * @param  {string} key
   * @param  {function} fn
   * @return {mixed}
   * @api public
   */
  
  get: function(key, fn) {
    exports.Store.prototype.get.apply(this, arguments)
    if (key.indexOf('*') === -1)
      return fn(this.data[key] instanceof Cache
        ? this.data[key].val
        : null)
    var regexp = this.normalize(key)      
    fn(this.data.reduce(function(vals, cache){
      if (regexp.test(cache.key))
        vals[cache.key] = cache.val
      return vals
    }, {}))
  },
  
  /**
   * Clear data matching the given _key_.
   *
   * Examples:
   *
   *   cache.clear('page:front', function(){})
   *   cache.clear('page:*', function(){})
   *
   * @param  {string} key
   * @param  {function} fn
   * @api public
   */
  
  clear: function(key, fn) {
    if (key.indexOf('*') === -1)
      delete this.data[key]
    else {
      var regexp = this.normalize(key)
      for (var key in this.data)
        if (this.data.hasOwnProperty(key))
          if (regexp.test(key))
            delete this.data[key]
    }
    fn()
  },
  
  /**
   * Reap caches older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var self = this,
        threshold = Number(new Date(Number(new Date) - ms))
    this.data.each(function(cache){
      if (cache.created < threshold)
        self.clear(cache.key, function(){})
    })
  },
  
  /**
   * Convert the given key matching _pattern_ 
   * into a RegExp.
   *
   *  - *  is converted to (.*?)
   *
   * @param  {string} pattern
   * @return {regexp}
   * @api private
   */
  
  normalize: function(pattern) {
    return new RegExp('^' + pattern.replace(/[*]/g, '(.*?)') + '$')
  }
})

// --- Cache

exports.Cache = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - dataStore                constructor name of cache data store, defaults to Store.Memory
     *  - lifetime                 lifetime of cache in milliseconds, defaults to one day
     *  - reapInterval, reapEvery  interval in milliseconds in which to reap old caches, defaults to one hour
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      this.merge(options || {})
      this.store = new (this.dataStore || exports.Store.Memory)(options)
      Request.include({ cache: this.store })
      this.startReaper()
    },
    
    /**
     * Start reaper.
     *
     * @api private
     */
    
    startReaper: function() {
      setInterval(function(self){
        self.store.reap(self.lifetime || (1).day)
      }, this.reapInterval || this.reapEvery || (1).hour, this)
    }
  }
})