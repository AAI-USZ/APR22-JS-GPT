


exports.Event = new Class({



constructor: function(name, data) {
this.name = name
Object.merge(this, data)
},



toString: function() {
return '[Event ' + this.name + ']'
}
})
