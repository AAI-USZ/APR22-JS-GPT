


process.mixin(GLOBAL, require('sys'))



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.path = path
this.fn = fn
},
run: function(){
return eval('with(Express.helpers){ (' + this.fn + ')() }')
