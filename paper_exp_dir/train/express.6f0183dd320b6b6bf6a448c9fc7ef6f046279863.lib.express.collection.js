


Collection = Class({



init: function(arr) {
var clone = toArray(arr)
this.length = clone.length
clone.unshift(0, clone.length)
Array.prototype.splice.apply(this, clone)
},



at: function(index) {
return this[index]
},



each: function(fn) {
for (var i = 0, len = this.length; i < len; ++i)
fn(i, this[i])
return this
}
