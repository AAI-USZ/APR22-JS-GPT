


exports.Event = Class({



init: function(name, data) {
this.name = name
process.mixin(this, data)
},



toString: function() {
return '[Event ' + this.name + ']'
}
})
