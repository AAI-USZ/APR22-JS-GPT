




var Request = require('./../request').Request



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
var regexp = this.normalize(key),
keys = Object.keys(this.data),
matches = {}
for (var i = 0, len = keys.length; i < len; ++i)
if (regexp.test(keys[i]))
matches[keys[i]] = this.data[keys[i]].val
callback(matches)
},



clear: function(key, callback) {
if (key.indexOf('*') === -1)
delete this.data[key]
else {
var regexp = this.normalize(key),
keys = Object.keys(this.data)
for (var i = 0, len = keys.length; i < len; ++i)
if (regexp.test(keys[i]))
delete this.data[keys[i]]
}
callback()
},



reap: function(ms) {
var threshold = +new Date(Date.now() - ms),
keys = Object.keys(this.data)
for (var i = 0, len = keys.length; i < len; ++i)
if (this.data[keys[i]].created < threshold ||
this.data[keys[i]].val === null)
this.clear(keys[i], function(){})
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
