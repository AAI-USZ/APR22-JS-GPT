


var n = 0

exports.Profiler = Plugin.extend({
extend: {



init: function(options) {
this.merge(options || {})
}
},



on: {



request: function(event) {
this.start = Number(new Date)
},



response: function(event) {
if (exports.Profiler.format === 'plot')
puts(Number(new Date) - this.start)
else
puts(event.request.method + ' ' +
event.request.url.pathname + ': ' +
(Number(new Date) - this.start) + ' ms' +
' #' + ++n)
