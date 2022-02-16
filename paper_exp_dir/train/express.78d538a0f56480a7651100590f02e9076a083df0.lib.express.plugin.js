




exports.use = function(plugin, options) {
if ('init' in plugin) plugin.init()
Express.plugins.push({
klass: plugin,
options: options
})
}



exports.Plugin = Class({



init: function(options) {
