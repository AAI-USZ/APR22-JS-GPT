


;(function(){

process.mixin(GLOBAL, require('sys'))



Route = Class({
init: function(method, path, fn, options){
this.method = method
this.path = path
this.fn = fn
}
})



Server = Class({
port: 3000,
host: 'localhost',
start: function(host, port){
var self = this
if (host) this.host = host
if (port) this.port = port
require('http')
.createServer(function(request, response){
self.request = request
(self.response = response).headers = {}
request.addListener('body', function(chunk){ request.body += chunk })
request.addListener('complete', function(){ self.route() })
})
.listen(this.port, this.host)
puts('Express started at http://' + this.host + ':' + this.port + '/')
},
route: function(){
if (typeof (this.response.body = route(request)) == 'string')
this.respond()
},
respond: function(body){
if (body) this.response.body = body
this.response.sendHeader(200, this.response.headers)
this.response.sendBody(this.response.body || '')
this.response.finish()
}
