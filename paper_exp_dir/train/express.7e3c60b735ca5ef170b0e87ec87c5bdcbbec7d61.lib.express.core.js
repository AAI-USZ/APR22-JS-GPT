
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

hookCallbacks : {
request : [



function (request, response) {
Express.request = request
request.headers = Express.arrayToHash(request.headers)
},



function (request, response) {
Express.response.cookie = request.cookie = Express.parseCookie(request.headers['Cookie'])
}
]
},

hook : function(name) {
for (var name in this.hookCallbacks)
if (this.hookCallbacks.hasOwnProperty(name))
for (i = 0, len = this.hookCallbacks[name].length; i < len; ++i)
this.hookCallbacks[name][i].apply(this, this.argsArray(arguments, 1))
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
Express.hook('request', request, response)
request.uri.params = Express.parseNestedParams(request.uri.params)
request.uri.path = Express.normalizePath(request.uri.path)
Express.response.body = Express.callRouteFor(request)
Express.prepareCookie()
Express.hook('response')
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

server : {



listen : function(port, callback) {
