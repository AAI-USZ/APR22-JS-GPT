




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
return this.store.values.length
},



reap: function(ms) {
var threshold = Number(new Date(Number(new Date) - ms))
this.store.each(function(session, sid){
if (session.lastAccess < threshold)
this.destroy(sid)
}, this)
}
})



exports.Session = Plugin.extend({
extend: {



init: function(options) {
this.merge(options || {})
this.store = new (this.dataStore || exports.Store.Memory)(options)
this.startReaper()
},



startReaper: function() {
setInterval(function(){
this.store.reap(this.lifetime || (1).day)
}, this.reapInterval || this.reapEvery || (1).hour, this)
}
},



on: {



