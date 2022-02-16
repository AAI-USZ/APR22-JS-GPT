




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
