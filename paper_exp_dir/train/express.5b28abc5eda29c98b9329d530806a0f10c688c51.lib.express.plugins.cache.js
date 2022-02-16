




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
var regexp = this.normalize(key),
keys = Object.keys(this.data)
for (var i = 0, len = keys.length; i < len; ++i)
if (regexp.test(this.data[keys[i]]))
delete this.data[keys[i]]
}
callback()
},



reap: function(ms) {
var threshold = +new Date(Date.now() - ms),
keys = Object.keys(this.data)
for (var i = 0, len = keys.length; i < len; ++i)
if (this.data[keys[i]].created < threshold)
