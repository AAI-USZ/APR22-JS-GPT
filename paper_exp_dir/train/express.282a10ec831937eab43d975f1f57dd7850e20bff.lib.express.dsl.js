




var http = require('express/http')



function route(method) {
return function(path, options, fn){
if (options instanceof Function)
fn = options, options = {}
if (path.indexOf('http://') === 0)
return http[method].apply(this, arguments)
