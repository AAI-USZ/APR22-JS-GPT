




var Event = exports.Event = Class({



init: function(name, data) {
this.name = name
this.request = Express.server.request
this.response = Express.server.response
process.mixin(this, data)
}
})





exports.trigger = function(name, data) {
$(Express.plugins).each(function(plugin){
plugin.trigger(new Event(name, data))
})
}



exports.use = function(plugin) {
Express.plugins.push(new plugin)
}



exports.Plugin = Class({
