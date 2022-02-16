


var before = [],
after = []



exports.before = function(fn) {
before.push(fn)
}



exports.after = function(fn) {
after.push(fn)
}



process.mixin(GLOBAL, exports)



exports.Hooks = Plugin.extend({
on: {
request: function(event) {
$(before).each(function(fn){
fn.call(event.request)
})
},

response: function(event) {
$(after).each(function(fn){
fn.call(event.request)
})
}
}
})
