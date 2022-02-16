


function options() {
var inOneDay = new Date(Number(new Date) + 86400)
return set('session') || { expires: inOneDay }
}

function reaper() {
setInterval(function(){
exports.Session.store.reap()
}, set('session reap interval') || 3600)
}

var Session = Class({
init: function(sid) {
this.id = sid
this.touch()
},
