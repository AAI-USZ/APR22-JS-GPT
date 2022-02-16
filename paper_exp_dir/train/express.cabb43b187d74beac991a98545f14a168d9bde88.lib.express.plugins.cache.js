




var Cache = new Class({



constructor: function(key, val) {
this.key = key
this.val = val
this.created = Number(new Date)
}
})



exports.Store = new Class({



set: function(key, val, fn) {
if (typeof key !== 'string')
throw new Error(this.name + ' store #set() key must be a string')
},



get: function(key, fn) {
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



set: function(key, val, fn) {
exports.Store.prototype.set.apply(this, arguments)
this.data[key] = new Cache(key, val)
if (fn instanceof Function) fn(val)
},



get: function(key, fn) {
exports.Store.prototype.get.apply(this, arguments)
if (key.indexOf('*') === -1)
return fn(this.data[key] instanceof Cache
? this.data[key].val
: null)
