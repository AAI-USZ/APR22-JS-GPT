
(function(){
Express = {
version : '0.0.1',
routes  : [],
response : {
body : null,
status : 200,
headers : {},
statuses : {
'ok'                 : 200,
'created'            : 201,
'accepted'           : 202,
'no content'         : 204,
'reset content'      : 205,
'partial content'    : 206,
'moved permanently'  : 301,
'found'              : 302,
'see other'          : 303,
'not modified'       : 304,
'use proxy'          : 305,
'switch proxy'       : 306,
'temporary redirect' : 307,
'bad request'        : 400,
'unauthorized'       : 401,
'forbidden'          : 403,
'not found'          : 404
}
},

defaultRoute : {
callback : function() {
Express.status('Not Found')
return 'Not Found'
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
Express.request = request
Express.response.body = Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

server : {



listen : function(port, callback) {
new node.http.Server(callback).listen(port)
puts('Express running at http://localhost:' + port)
}
},



hashToArray : function(hash) {
var array = []
for (var key in hash)
if (hash.hasOwnProperty(key))
array.push([key, hash[key]])
return array
},



arrayToHash : function(array) {
var hash = {}
for (var i = 0, len = array.length; i < len; ++i)
hash[array[i][0]] = array[i][1]
return hash
},



status : function(value) {
this.response.status = this.response.statuses[value.toString().toLowerCase()] || value
},



header : function(name, value) {
return value ? this.response.headers[name] = value :
this.response.headers[name]
},



contentsOf : function(body) {
return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
},

dump : function(object) {
puts(JSON.stringify(object))
},

callRouteFor : function(request) {







var route = this.findRouteFor(request) || this.defaultRoute
return eval('function(){ with (Express){' + Express.contentsOf(route.callback) + '}}')()
},

findRouteFor : function(request) {
for (var i = 0, len = this.routes.length; i < len; ++i)
if (this.routeMatches(this.routes[i], request))
return this.routes[i]
},

