
// Express - Session - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

function options() {
  var inOneDay = new Date(Number(new Date) + 86400)
  return set('session') || { expires: inOneDay }
}

function reaper() {
  setInterval(function(){
    exports.Session.store.reap(set('session reap threshold') || 86400)
  }, set('session reap interval') || 3600)
}

var Session = Class({
  init: function(sid) {
    this.id = sid
    this.touch()
  },
  
  touch: function() {
    this.lastAccess = Number(new Date)
  }
})

exports.MemoryStore = Class({
  init: function() {
    this.store = {}
  },
  
  fetch: function(sid) {
    return this.store[sid] || new Session(sid)
  },
  
  commit: function(session) {
    return this.store[session.id] = session
  },
  
  clear: function() {
    this.store = {}
  },
  
  destroy: function(sid) {
    delete this.store[sid]
  },
  
  reap: function(ms) {
    var threshold = Number(new Date(Number(new Date) - ms))
    for (var sid in this.store)
      if (this.store.hasOwnProperty(sid))
        if (this.store[sid].lastAccess < threshold)
          this.destroy(sid)
  }
})

exports.Session = Plugin.extend({
  extend: {
    
    /**
     * Initialize memory store and start reaper.
     *
     * Options:
     *
     *  - store:  Session data-store constructor, defaults to MemoryStore 
     *
     * @param  {hash} options
     */
    
    init: function(opts) {
      opts = opts || {}
      this.store = new (opts.store || exports.MemoryStore)(options())
      reaper()
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
        event.request.cookie('sid', sid = uid(), options())
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