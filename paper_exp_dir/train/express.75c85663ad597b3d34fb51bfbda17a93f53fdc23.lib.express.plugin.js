




exports.use = function(plugin, options) {
if (Express.environment === 'test' && 'init' in plugin)
plugin.init(options)
$(Express.plugins).each(function(other, i){
if (other.klass === plugin)
delete Express.plugins[i]
})
Express.plugins.push({
klass: plugin,
options: options
})
