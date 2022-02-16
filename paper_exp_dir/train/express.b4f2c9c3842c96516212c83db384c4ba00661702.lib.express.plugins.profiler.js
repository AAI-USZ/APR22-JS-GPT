


exports.Profiler = Plugin.extend({
on: {
request: function(event) {
this.start = Number(new Date)
},

response: function(event) {
puts(event.request.method + ' ' +
event.request.uri.path + ': ' +
(Number(new Date) - this.start) + ' ms')
