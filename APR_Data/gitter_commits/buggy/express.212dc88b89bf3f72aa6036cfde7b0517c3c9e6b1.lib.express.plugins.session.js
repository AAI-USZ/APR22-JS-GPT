
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Module dependencies.
 */
 
var utils = require('express/utils')

// --- Session

var Session = new Class({
  
  /**
   * Initialize session _sid_.
   */
  
  constructor: function(sid) {
    this.id = sid
    this.touch()
  },
  
  /**
   * Update last access time.
   *
   * @api private
   */
  
  touch: function() {
    this.lastAccess = Number(new Date)
  }
})

// --- Store

exports.Store = new Class({
  
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
   * Initialize in-memory session store.
   */
  
  constructor: function() {
    this.store = {}
  },
  
  /**
   * Fetch session with the given _sid_ or 
   * a new Session is returned.
   *
   * @param  {int} sid
   * @return {Session}
   * @api private
   */
  
  fetch: function(sid) {
    return this.store[sid] || new Session(sid)
  },
  
  /**
   * Commit _session_ data.
   *
   * @param  {Session} session
   * @api private
   */
  
  commit: function(session) {
    return this.store[session.id] = session
  },
  
  /**
   * Clear all sessions.
   *
   * @api public
   */
  
  clear: function() {
    this.store = {}
  },
  
  /**
   * Destroy session using the given _sid_.
   *
   * @param  {int} sid
   * @api public
   */
  
  destroy: function(sid) {
    delete this.store[sid]
  },
  
  /**
   * Return the number of sessions currently stored.
   *
   * @return {int}
   * @api public
   */
  
  length: function() {
    return this.store.values.length
  },
  
  /**
   * Reap sessions older than _ms_.
   *
   * @param  {int} ms
   * @api private
   */
  
  reap: function(ms) {
    var threshold = Number(new Date(Number(new Date) - ms))
    this.store.each(function(session, sid){
      if (session.lastAccess < threshold)
        this.destroy(sid)
    }, this)
  }
})

// --- Session

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - dataStore                constructor name of session data store, defaults to Store.Memory
     *  - lifetime                 lifetime of session in milliseconds, defaults to one day
     *  - reapInterval, reapEvery  interval in milliseconds in which to reap old sessions, defaults to one hour
     * 
     * @param  {hash} options
     * @api private
     */
    
    init: function(options) {
      this.merge(options || {})
      this.store = new (this.dataStore || exports.Store.Memory)(options)
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
  },
  
  // --- Events
  
  on: {
    
    /**
     * Create session id when not found; delegate to store.
     */
    
    request: function(event) {
      var sid
      if (!(sid = event.request.cookie('sid')))
        event.request.cookie('sid', sid = utils.uid(), set('session cookie'))
      event.request.session = exports.Session.store.fetch(sid)
      event.request.session.touch()
    },
    
    /**
     * Delegate to store, allowing it to save sessions changes.
     */
    
    response: function(event) {
      exports.Session.store.commit(event.request.session)
    }
  }
})