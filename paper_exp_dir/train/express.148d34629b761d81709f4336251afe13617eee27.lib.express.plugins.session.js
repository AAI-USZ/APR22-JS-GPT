




var utils = require('express/utils')



var Session = Class({



init: function(sid) {
this.id = sid
this.touch()
},



touch: function() {
this.lastAccess = Number(new Date)
}
})



exports.Store = Class({



toString: function() {
return '[' + this.name + ' Store]'
}
})



exports.MemoryStore = exports.Store.extend({



name: 'Memory',

