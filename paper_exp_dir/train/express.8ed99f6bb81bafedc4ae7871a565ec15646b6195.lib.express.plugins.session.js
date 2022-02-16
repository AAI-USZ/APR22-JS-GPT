


function options() {
var inOneDay = new Date(Number(new Date) + 86400)
return set('session') || { expires: inOneDay }
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
