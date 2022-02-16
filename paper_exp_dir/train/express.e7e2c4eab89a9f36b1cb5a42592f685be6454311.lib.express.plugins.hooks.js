


var before = [],
after = []



exports.before = function(fn) {
before.push(fn)
}



exports.after = function(fn) {
after.push(fn)
}



exports.Hooks = Plugin.extend({
extend: {



init: function() {
process.mixin(GLOBAL, exports)
}
},



