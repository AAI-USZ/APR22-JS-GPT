




exports.Store = Class({
toString: function() {
return '[' + this.name + ' Store]'
},

set: function(key, val) {
if (typeof key !== 'string') throw new Error(this.name + ' store #set() key must be a string')
if (typeof val !== 'string') throw new Error(this.name + ' store #set() value must be a string')
},

get: function(key) {
if (typeof key !== 'string') throw new Error(this.name + 'store #get() key must be a string')
}
