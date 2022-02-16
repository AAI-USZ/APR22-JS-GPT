




var Cache = new Class({



constructor: function(key, val) {
this.key = key
this.val = val
this.created = Number(new Date)
}
})



exports.Store = new Class({



set: function(key, val) {
if (typeof key !== 'string')
throw new Error(this.name + ' store #set() key must be a string')
},



get: function(key) {
if (typeof key !== 'string')
throw new Error(this.name + 'store #get() key must be a string')
},



toString: function() {
return '[' + this.name + ' Store]'
}
})



exports.Store.Memory = exports.Store.extend({



name: 'Memory',



constructor: function() {
this.data = {}
},



set: function(key, val) {
exports.Store.prototype.set.apply(this, arguments)
return this.data[key] = new Cache(key, val), val
},



get: function(key) {
exports.Store.prototype.get.apply(this, arguments)
if (key.indexOf('*') === -1)
return this.data[key] instanceof Cache ?
this.data[key].val :
null
var regexp = this.normalize(key)
return this.data.reduce(function(vals, cache){
if (regexp.test(cache.key))
vals[cache.key] = cache.val
return vals
}, {})
},



clear: function(key) {
if (key.indexOf('*') === -1)
return delete this.data[key]
var regexp = this.normalize(key)
for (var key in this.data)
if (this.data.hasOwnProperty(key))
if (regexp.test(key))
delete this.data[key]
},



reap: function(ms) {
var self = this,
threshold = Number(new Date(Number(new Date) - ms))
this.data.each(function(cache){
if (cache.created < threshold)
self.clear(cache.key)
})
},



normalize: function(pattern) {
return new RegExp('^' + pattern.replace(/[*]/g, '(.*?)') + '$')
}
})



exports.Cache = Plugin.extend({
extend: {



init: function(options) {
this.merge(options || {})
this.store = new (this.dataStore || exports.Store.Memory)(options)
Request.include({ cache: this.store })
this.startReaper()
},



startReaper: function() {
setInterval(function(self){
self.store.reap(self.lifetime || (1).day)
}, this.reapInterval || this.reapEvery || (1).hour, this)
}
}
})
