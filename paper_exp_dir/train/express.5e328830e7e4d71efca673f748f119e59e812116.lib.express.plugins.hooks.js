




exports.callbacks = { before: [], after: [] }



exports.before = function(callback) {
exports.callbacks.before.push(callback)
}



exports.after = function(callback) {
exports.callbacks.after.push(callback)
}



exports.Hooks = Plugin.extend({
extend: {



init: function() {
Object.merge(global, {
before: exports.before,
after: exports.after
})
}
},



on: {



request: function(event) {
exports.callbacks.before.each(function(callback){
callback.call(event.request, event.request)
})
},



response: function(event) {
exports.callbacks.after.each(function(callback){
callback.call(event.request, event.request)
})
}
}
})
