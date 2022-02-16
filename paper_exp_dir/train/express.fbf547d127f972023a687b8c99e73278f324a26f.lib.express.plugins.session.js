


function options() {
var inOneDay = new Date(Number(new Date) + 86400)
return set('session') || { expires: inOneDay }
}

var Session = Class({
init: function(sid) {
this.id = sid
this.touch()
},

