


process.mixin(require('sys'))
process.mixin(require('express/helpers'))



ExpressError = Class({
name: 'ExpressError',
init: function(message) {
this.message = message
},
toString: function() {
return this.name + ': ' + this.message
}
