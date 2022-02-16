




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



exports.use = function(plugin, options) {
Express.plugins.push(new plugin(options))
}



exports.Plugin = Class({



init: function(options) {
if (options)
process.mixin(this, options)
},


