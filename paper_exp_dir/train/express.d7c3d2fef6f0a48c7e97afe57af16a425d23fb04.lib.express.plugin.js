




exports.trigger = function(name, data) {
$(Express.server.request.plugins).each(function(plugin){
plugin.trigger(new Event(name, data))
})
}



exports.use = function(plugin, options) {
Express.plugins.push({
