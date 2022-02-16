




var Request = require('express/request').Request



var Cache = new Class({



constructor: function(key, val) {
this.key = key
this.val = val
this.created = Date.now()
}
})



exports.Store = new Class({



set: function(key, val, callback) {
if (typeof key !== 'string')
throw new Error(this.name + ' store #set() key must be a string')
},



get: function(key, callback) {
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



set: function(key, val, callback) {
exports.Store.prototype.set.apply(this, arguments)
this.data[key] = new Cache(key, val)
if (callback) callback(val)
},



get: function(key, callback) {
exports.Store.prototype.get.apply(this, arguments)
if (key.indexOf('*') === -1)
return callback(this.data[key] instanceof Cache
? this.data[key].val
: null)
var regexp = this.normalize(key)
callback(this.data.reduce(function(vals, cache){
if (regexp.test(cache.key))
vals[cache.key] = cache.val
return vals
}, {}))
},



clear: function(key, callback) {
if (key.indexOf('*') === -1)
delete this.data[key]
else {
var regexp = this.normalize(key)
this.data.each(function(val, key){
if (regexp.test(key))
delete this.data[key]
}, this)
}
callback()
},



reap: function(ms, callback) {
var self = this,
threshold = +new Date(Date.now() - ms)
this.data.each(function(cache){
if (cache.created < threshold)
self.clear(cache.key, function(){})
})
if (callback) callback()
},



normalize: function(pattern) {
return new RegExp('^' + pattern.replace(/[*]/g, '(.*?)') + '$')
}
})



exports.Cache = Plugin.extend({
extend: {



init: function(options) {
Object.merge(this, options)
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
