




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



init: function(options) {
process.mixin(this, options)
this.store = new (this.dataStore || exports.MemoryStore)(options)
this.startReaper()
},



startReaper: function() {
var self = this,
oneDay = 86400000,
oneHour = 3600000
setInterval(function(){
self.store.reap(self.lifetime || oneDay)
}, self.reapInterval || oneHour)
}
},



on: {



request: function(event) {
var sid
if (!(sid = event.request.cookie('sid')))
event.request.cookie('sid', sid = uid(), set('session cookie'))
event.request.session = exports.Session.store.fetch(sid)
event.request.session.touch()
},



response: function(event) {
exports.Session.store.commit(event.request.session)
}
}
})
