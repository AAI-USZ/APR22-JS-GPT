


exports.MethodOverride = Plugin.extend({
on: {
request: function(event) {
if (param('__method__'))
event.request.method = param('__method__').toLowerCase()
}
}
})
