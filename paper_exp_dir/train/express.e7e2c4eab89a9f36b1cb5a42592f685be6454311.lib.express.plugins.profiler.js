


exports.Profiler = Plugin.extend({
on: {



request: function(event) {
this.start = Number(new Date)
},



response: function(event) {
