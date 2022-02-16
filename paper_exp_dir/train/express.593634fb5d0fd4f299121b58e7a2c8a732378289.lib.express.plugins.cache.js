




var Cache = Class({



init: function(key, val) {
this.key = key
this.val = val
this.created = Number(new Date)
}
})



exports.Store = Class({



set: function(key, val) {
if (typeof key !== 'string')
throw new Error(this.name + ' store #set() key must be a string')
},



get: function(key) {
if (typeof key !== 'string')
throw new Error(this.name + 'store #get() key must be a string')
},



