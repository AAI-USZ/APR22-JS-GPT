


Collection = Class({



init: function(arr) {
var clone = toArray(arr)
this.length = clone.length
clone.unshift(0, clone.length)
Array.prototype.splice.apply(this, clone)
}
})
