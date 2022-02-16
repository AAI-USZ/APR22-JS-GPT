




var Request = require('express/request').Request,
utils = require('express/utils')



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
callback(null, this.store.values.length)
},



reap: function(ms) {
var threshold = +new Date(Date.now() - ms),
sids = Object.keys(this.store)
for (var i = 0, len = sids.length; i < len; ++i)
if (this.store[sids[i]].lastAccess < threshold)
this.destroy(sids[i])
},



generate: function(callback) {
callback(null,  new exports.Base(utils.uid()))
