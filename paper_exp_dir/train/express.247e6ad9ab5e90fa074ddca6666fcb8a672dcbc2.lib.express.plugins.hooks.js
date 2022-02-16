




exports.callbacks = { before: [], after: [] }



exports.before = function(fn) {
exports.callbacks.before.push(fn)
}



exports.after = function(fn) {
