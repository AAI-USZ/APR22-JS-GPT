
(function(){
Express = {
version : '0.0.1',
routes  : [],



response : {
body : null,
status : 200,
headers : {},
cookie : {}
},



defaults : {
cookie : {
maxAge : 3600
},
route : {
callback : function() {
Express.status('Not Found')
'Not Found'
}
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){

request.headers = Express.arrayToHash(request.headers)
request.cookie = Express.parseCookie(request.headers['Cookie'])
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.request = request
Express.response.cookie = request.cookie
Express.response.body = Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.prepareResponseHeaders(Express.hashToArray(Express.response.headers)))
