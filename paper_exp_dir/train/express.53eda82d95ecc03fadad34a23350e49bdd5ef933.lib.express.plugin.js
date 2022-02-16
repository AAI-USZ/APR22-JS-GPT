




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
(new plugin.klass(plugin.options)).trigger(new Event(name, data))
})
}



exports.use = function(plugin, options) {
Express.plugins.push({
klass: plugin,
options: options
})
}



exports.Plugin = Class({


