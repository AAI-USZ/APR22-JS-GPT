




exports.use = function(plugin, options) {
Express.plugins.push({
klass: plugin,
options: options
})
}



exports.Plugin = Class({


