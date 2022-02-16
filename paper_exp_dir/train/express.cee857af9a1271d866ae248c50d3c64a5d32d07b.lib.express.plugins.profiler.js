


var n = 0

exports.Profiler = Plugin.extend({
on: {



request: function(event) {
this.start = Number(new Date)
},


