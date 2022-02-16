


var before = [],
after = []



exports.before = function(fn) {
before.push(fn)
}



exports.after = function(fn) {
after.push(fn)
}
