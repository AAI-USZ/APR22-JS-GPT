




exports.callbacks = { before: [], after: [] }



exports.before = function(fn) {
exports.callbacks.before.push(fn)
}



exports.after = function(fn) {
exports.callbacks.after.push(fn)
}



exports.Hooks = Plugin.extend({
extend: {



init: function() {
global.merge({
before: exports.before,
after: exports.after
})
}
},



on: {



request: function(event) {
exports.callbacks.before.each(function(fn){
fn.call(event.request, event.request)
})
},



response: function(event) {
exports.callbacks.after.each(function(fn){
fn.call(event.request, event.request)
})
}
}
})
