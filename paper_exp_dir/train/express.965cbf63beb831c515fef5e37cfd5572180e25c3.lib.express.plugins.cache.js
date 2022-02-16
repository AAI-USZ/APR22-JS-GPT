




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
})



exports.Store.Memory = exports.Store.extend({
name: 'Memory',
init: function() {
this.data = {}
},
set: function(key, val) {
this.__super__(key, val)
return this.data[key] = val
},
get: function(key) {
this.__super__(key)
return key.indexOf('*') === -1 ?
this.data[key] :
this.search(key)
},
clear: function(key) {
if (key.indexOf('*') === -1)
delete this.data[key]
else
key = this.normalize(key)
},
normalize: function(pattern) {
return new RegExp('^' + pattern.replace(/[*]/g, '(.*?)') + '$')
},
search: function(pattern) {
var vals = {},
regexp = this.normalize(pattern)
