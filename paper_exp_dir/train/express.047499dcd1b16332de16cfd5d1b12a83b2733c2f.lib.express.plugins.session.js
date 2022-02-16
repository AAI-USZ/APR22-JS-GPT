


var Session = Class({
init: function(sid) {
this.id = sid
this.touch()
},

touch: function() {
this.lastAccess = Number(new Date)
require('sys').p('touched ' + this.id)
}
})
