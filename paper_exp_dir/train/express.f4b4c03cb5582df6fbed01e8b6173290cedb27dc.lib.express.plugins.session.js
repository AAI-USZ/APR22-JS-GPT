


exports.MemoryStore = Class({
init: function() {
this.store = {}
},

fetch: function(sid) {
return this.store[sid] || {}
},

commit: function(sid, hash) {
return this.store[sid] = hash
