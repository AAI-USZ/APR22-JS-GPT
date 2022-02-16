


;(function(){



Express = { version: '0.0.1' }



var plugins = [],
routes = []



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.path = path
this.fn = fn
}
})



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
