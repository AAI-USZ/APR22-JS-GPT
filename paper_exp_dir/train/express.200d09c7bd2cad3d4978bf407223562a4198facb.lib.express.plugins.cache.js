




var Cache = Class({



init: function(key, val) {
this.key = key
this.val = val
this.created = Number(new Date)
}
})



exports.Store = Class({



set: function(key, val) {
if (typeof key !== 'string') throw new Error(this.name + ' store #set() key must be a string')
},



get: function(key) {
if (typeof key !== 'string') throw new Error(this.name + 'store #get() key must be a string')
},



toString: function() {
return '[' + this.name + ' Store]'
}
})



exports.Store.Memory = exports.Store.extend({



name: 'Memory',



init: function() {
this.data = {}
},



set: function(key, val) {
this.__super__(key, val)
return this.data[key] = new Cache(key, val), val
},



get: function(key) {
this.__super__(key)
if (key.indexOf('*') === -1)
return this.data[key] instanceof Cache ?
this.data[key].val :
null
var regexp = this.normalize(key)
return $(this.data).reduce({}, function(vals, cache){
if (regexp.test(cache.key))
vals[cache.key] = cache.val
return vals
})
},



clear: function(key) {
if (key.indexOf('*') === -1)
