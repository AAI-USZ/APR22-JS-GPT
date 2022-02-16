







exports.Base = new Class({



constructor: function(sid) {
this.id = sid
this.touch()
},



touch: function() {
this.lastAccess = Date.now()
}
})



exports.Store = new Class({



toString: function() {
return '[' + this.name + ' Store]'
}
})



exports.Store.Memory = exports.Store.extend({



name: 'Memory',



constructor: function() {
this.store = {}
},



fetch: function(sid, callback) {
if (sid && this.store[sid])
callback(null, this.store[sid])
else
this.generate(callback)
},



commit: function(session, callback) {
this.store[session.id] = session
if (callback) callback(null, session)
},



clear: function(callback) {
this.store = {}
if (callback) callback()
},



destroy: function(sid, callback) {
delete this.store[sid]
if (callback) callback(sid)
},



length: function(callback) {
callback(null, Object.keys(this.store).length)
},



reap: function(ms) {
var threshold = +new Date(Date.now() - ms),
sids = Object.keys(this.store)
for (var i = 0, len = sids.length; i < len; ++i)
if (this.store[sids[i]].lastAccess < threshold)
this.destroy(sids[i])
},



generate: function(callback) {
callback(null, new exports.Base(utils.uid()))
}
})



exports.Session = Plugin.extend({
extend: {



init: function(options) {
this.cookie = {}
Object.merge(this, options)
this.cookie.httpOnly = true
this.store = new (this.dataStore || exports.Store.Memory)(options)
this.startReaper()
},



startReaper: function() {
setInterval(function(self) {
self.store.reap(self.lifetime || (1).day)
}, this.reapInterval || this.reapEvery || (1).hour, this)
}
},



on: {



request: function(event, callback) {
var sid = event.request.cookie('sid')
if (!sid && event.request.url.pathname === '/favicon.ico') return
exports.Session.store.fetch(sid, function(err, session) {
if (err) return callback(err)
if (session.id != sid)
event.request.cookie('sid', session.id, exports.Session.cookie)
event.request.session = session
event.request.session.touch()
callback()
})
return true
},



response: function(event, callback) {
if (event.request.session)
return exports.Session.store.commit(event.request.session, callback),
true
}
}
})
