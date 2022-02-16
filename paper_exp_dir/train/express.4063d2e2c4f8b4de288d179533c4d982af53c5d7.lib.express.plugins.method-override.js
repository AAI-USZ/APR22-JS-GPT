


exports.MethodOverride = Plugin.extend({
on: {



request: function(event, callback) {
if (event.request.param('_method'))
event.request.method = event.request.param('_method').toLowerCase()

callback();
}
