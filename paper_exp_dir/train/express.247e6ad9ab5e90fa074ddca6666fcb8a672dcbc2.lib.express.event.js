


exports.Event = Class({



init: function(name, data) {
this.name = name
this.merge(data || {})
},



toString: function() {
return '[Event ' + this.name + ']'
