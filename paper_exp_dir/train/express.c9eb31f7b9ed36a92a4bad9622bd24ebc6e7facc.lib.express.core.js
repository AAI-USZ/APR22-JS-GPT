
(function(){
Express = {
version : '0.0.1',
routes  : [],
response : {
body : null,
status : 200,
headers : {}
},

defaultRoute : {
callback : function() {
Express.status('Not Found')
return 'Not Found'
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.request = request
Express.response.body = Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

