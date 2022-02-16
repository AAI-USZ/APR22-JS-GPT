




var utils = require('express/utils')



var Session = Class({



init: function(sid) {
this.id = sid
this.touch()
},



touch: function() {
this.lastAccess = Number(new Date)
}
})



exports.Store = Class({



toString: function() {
return '[' + this.name + ' Store]'
}
})



exports.Store.Memory = exports.Store.extend({



name: 'Memory',



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



length: function() {
return $(this.store).length()
},



reap: function(ms) {
var self = this,
threshold = Number(new Date(Number(new Date) - ms))
$(this.store).each(function(session, sid){
if (session.lastAccess < threshold)
self.destroy(sid)
})
}
})



exports.Session = Plugin.extend({
extend: {



init: function(options) {
process.mixin(this, options)
this.store = new (this.dataStore || exports.Store.Memory)(options)
this.startReaper()
},



startReaper: function() {
var self = this,
oneDay = 86400000,
oneHour = 3600000
setInterval(function(){
self.store.reap(self.lifetime || oneDay)
}, self.reapInterval || self.reapEvery || oneHour)
}
},



on: {



request: function(event) {
var sid
if (!(sid = event.request.cookie('sid')))
event.request.cookie('sid', sid = utils.uid(), set('session cookie'))
event.request.session = exports.Session.store.fetch(sid)
event.request.session.touch()
},



response: function(event) {
exports.Session.store.commit(event.request.session)
}
}
})
