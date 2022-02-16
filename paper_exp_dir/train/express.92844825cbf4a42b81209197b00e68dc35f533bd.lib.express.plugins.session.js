




var utils = require('express/utils')



exports.Base = new Class({



constructor: function(sid) {
this.id = sid
this.touch()
},



touch: function() {
this.lastAccess = Number(new Date)
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
callback(null, this.store.values.length)
},



reap: function(ms, callback) {
var threshold = Number(new Date(Number(new Date) - ms))
this.store.each(function(session, sid){
if (session.lastAccess < threshold)
this.destroy(sid)
}, this)
if (callback) callback()
},



generate: function(callback) {
callback(null,  new exports.Base(utils.uid()))
}
})



exports.Session = Plugin.extend({
extend: {



init: function(options) {
this.cookie = {}
this.merge(options || {})
this.cookie.httpOnly = true
this.store = new (this.dataStore || exports.Store.Memory)(options)
this.startReaper()
},



startReaper: function() {
setInterval(function(self) {
self.store.reap(self.lifetime || (1).day)
}, this.reapInterval || this.reapEvery || (1).hour, this)
