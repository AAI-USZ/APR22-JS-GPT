




var utils = require('express/utils');



exports.use = function(plugin, options) {
if (Express.environment === 'test' && 'init' in plugin)
plugin.init(options)
Express.plugins.each(function(other, i){
if (other.klass === plugin)
delete Express.plugins[i]
})
Express.plugins.push({
klass: plugin,
options: options
})
}






constructor: function(options) {
if (options)
utils.mixin(this, options)
},



trigger: function(event, callback) {
if ('on' in this)
if (event.name in this.on)
return this.on[event.name].call(this, event, callback)
}
})
