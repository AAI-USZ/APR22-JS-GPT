


exports.MethodOverride = Plugin.extend({
on: {



if (event.request.param('_method'))
event.request.method = event.request.param('_method').toLowerCase()
