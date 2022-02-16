




exports.use = function(plugin, options) {
if ('init' in plugin) plugin.init(options)
Express.plugins.push({
klass: plugin,
options: options
})
}



exports.Plugin = Class({



init: function(options) {
if (options)
process.mixin(this, options)
},



trigger: function(event) {
if ('on' in this)
if (event.name in this.on)
this.on[event.name].call(this, event)
}
})
